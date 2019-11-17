const express = require("express");
const db = require("../models");

const router = express.Router();

router.get(`/`, async (req, res, next) => {
  // GET /api/posts
  try {
    const posts = await db.Post.findAll({
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname"]
        },
        {
          model: db.Image
        }
      ],
      order: [["createdAt", "DESC"]] // DESC 내림차순, ASC 오름차순
    }); // db에서 가져온 객체를 그대로 쓸 때는 toJSON() X. 새로운 객체를 만들 때는 .toJSON() 작업 필요
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;
