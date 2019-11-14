const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../models");

const router = express.Router();

router.get(`/`, (req, res) => {});
router.post(`/`, async (req, res, next) => {
  try {
    const { password, nickname, userId } = req.body;
    const exUser = await db.User.findOne({
      where: {
        userId
      }
    });
    if (exUser) {
      return res.status(403).send("이미 사용 중인 아이디입니다.");
    }
    const hashedPassword = await bcrypt.hash(password, 12); // salt는 10~13 사이로
    const newUser = await db.User.create({
      nickname: nickname,
      userId: userId,
      password: hashedPassword
    });
    console.log(newUser);
    return res.status(200).json(newUser);
  } catch (e) {
    console.error(e);
    // TODO: 에러 처리
    return next(e);
  }
});
router.get(`/:id`, (req, res) => {
  // 남의 정보 가져오기 ex) req.params.id
});
router.post(`/logout`, (req, res) => {});
router.post(`/login`, (req, res) => {});
router.get(`/:id/follow`, (req, res) => {});
router.post(`/:id/follow`, (req, res) => {});
router.delete(`/:id/follow`, (req, res) => {});
router.delete(`/:id/follower`, (req, res) => {});
router.get(`/:id/posts`, (req, res) => {});

module.exports = router;
