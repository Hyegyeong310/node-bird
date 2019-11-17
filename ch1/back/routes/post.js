const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const { isLoggedIn } = require("./middleware");
const db = require("../models");

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads"); // done(server error, success)
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext); // 제로초.png, ext === png, basename === 제로초
      done(null, basename + new Date().valueOf() + ext);
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 }
});

router.post(`/`, isLoggedIn, upload.none(), async (req, res, next) => {
  // /api/post
  try {
    const { content } = req.body;
    const hashtags = content.match(/#[^\s]+/g); // '#'과 있는 문자열을 배열로 리턴
    const newPost = await db.Post.create({
      content,
      UserId: req.user.id
    });
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag =>
          db.Hashtag.findOrCreate({
            // 없으면 넣고 있으면 아무 것도 하지 않는다.
            where: { name: tag.slice(1).toLowerCase() }
          })
        )
      );
      console.log({ result });
      await newPost.addHashtags(result.map(r => r[0]));
    }
    if (req.body.image) {
      // image address를 여러개 올리면 image:[주소1, 주소2]
      if (Array.isArray(req.body.image)) {
        const images = await Promise.all(
          req.body.image.map(image => {
            return db.Image.create({ src: image });
          })
        );
        await newPost.addImages(images);
      } else {
        // 이미지가 하나면 image: 주소1
        const image = await db.Image.create({ src: req.body.image });
        await newPost.addImage(image);
      }
    }
    /*
    // 1번째 방법
    const User = await newPost.getUser();
    newPost.User = User;
    res.json(newPost);
    */
    // 2번째 방법
    const fullPost = await db.Post.findOne({
      where: { id: newPost.id },
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname"]
        },
        {
          model: db.Image
        }
      ]
    });
    return res.json(fullPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

// upload.array() -> 여러 장, .single() -> 한 장, fields() -> formData에서 이미지마다 name이 다를 때, none() -> 이미지 or file 등을 하나도 올리지 않을 때
router.post(`/images`, upload.array("image"), (req, res) => {
  res.json(req.files.map(v => v.filename));
});

router.get("/:id/comments", async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: { id: req.params.id }
    });
    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다.");
    }
    const comments = await db.Comment.findAll({
      where: {
        PostId: req.params.id
      },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname"]
        }
      ]
    });
    res.json(comments);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/:id/comment", isLoggedIn, async (req, res, next) => {
  // POST /api/post/3/comment
  try {
    const post = await db.Post.findOne({
      where: { id: req.params.id }
    });
    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다.");
    }
    const newComment = await db.Comment.create({
      PostId: post.id,
      UserId: req.user.id,
      content: req.body.content
    });
    await post.addComment(newComment.id);
    const comment = await db.Comment.findOne({
      where: {
        id: newComment.id
      },
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname"]
        }
      ]
    });
    return res.json(comment);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post("/:id/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: { id: req.params.id }
    });
    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다.");
    }
    await post.addLiker(req.user.id);
    res.json({
      userId: req.user.id
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
});
router.delete("/:id/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: { id: req.params.id }
    });
    if (!post) {
      return res.status(404).send("포스트가 존재하지 않습니다.");
    }
    await post.removeLiker(req.user.id);
    res.json({
      userId: req.user.id
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
