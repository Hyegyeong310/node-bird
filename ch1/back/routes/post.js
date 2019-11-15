const express = require("express");
const router = express.Router();
const db = require("../models");

router.post(`/`, async (req, res, next) => {
  // /api/post
  const { content } = req.body;
  try {
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

module.exports = router;
