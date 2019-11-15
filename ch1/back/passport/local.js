const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const bcrypt = require("bcrypt");
const db = require("../models");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "userId",
        passwordField: "password"
      },
      async (userId, password, done) => {
        try {
          const user = await db.User.findOne({
            where: { userId }
          });
          if (!user) {
            return done(null, false, { reason: "존재하지 않는 사용자입니다." });
            // done(서버쪽 에러, 성공, 서버에러는 아니지만 로직상 에러)
          }
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          }
          return done(null, false, { reason: "비밀번호가 맞지 않습니다." });
        } catch (e) {
          console.error(e);
          return done(e);
        }
      }
    )
  );
};
