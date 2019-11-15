const passport = require("passport");
const db = require("../models");
const local = require("./local"); // 전략 연결

module.exports = () => {
  // 서버 쪽에 [{id:3, cookie:'akdhgihe'}] 같은 cookie 요청이 오면 서버에서 해당 id data를 보내준다.
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.User.findOne({
        where: { id }
      });
      return done(null, user); // req.user
    } catch (e) {
      console.error(e);
      return done(e);
    }
  });

  local();
};

// ex) [{id: 3, cookie: 'eihgijdf'}]
// front에서는 서버로 cookie만 보낸다. (프론트 eihgijdf 전송) 쿠키로는 누구의 데이터인지 알 수 없음.
// 서버가 cookie parser, express-session으로 쿠키 검사(serializeUser) 후 쿠키에 해당하는 id를 발견(서버 id:3 발견)
// id:3이 deserializeUser에 들어감
// req.user로 사용자 정보 들어감

// 요청 보낼 때마다 deserializeUser가 실행된다. // 서버 비용 중 제일 비쌈.
// 실무에서는 deserializeUser 결과를 캐싱한다. 한 번 찾은 유저는 다시 찾지 않도록
