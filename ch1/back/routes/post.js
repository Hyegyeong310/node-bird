const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("./middleware");
const db = require("../models");

router.post(`/`, isLoggedIn, async (req, res, next) => {
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
          model: db.User
        }
      ]
    });
    return res.json(fullPost);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
router.post(`/images`, (req, res) => {});

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
module.exports = router;
