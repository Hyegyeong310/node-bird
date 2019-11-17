const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const dotenv = require("dotenv");
const passport = require("passport");
const passportConfig = require("./passport");

const db = require("./models");
const userAPIRouter = require("./routes/user");
const postAPIRouter = require("./routes/post");
const postsAPIRouter = require("./routes/posts");
const hashtagAPIRouter = require("./routes/hashtag");

dotenv.config();

const PORT = process.env.PORT;
const app = express();
db.sequelize.sync();
passportConfig();

app.use(morgan("dev"));
app.use("/", express.static("uploads"));
app.use(express.json()); // 데이터 처리
app.use(express.urlencoded({ extended: true })); // form 처리
app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  expressSession({
    resave: false, // 매번 세션 강제 저장
    saveUninitialized: false, // 빈 값도 저장
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false // https를 사용할 때 true 사용
    },
    name: "rnbck"
  })
);
app.use(passport.initialize());
app.use(passport.session()); // 미들웨어 간 의존관계가 있을 시 순서가 중요!

// api는 다른 서비스가 내 서비스의 기능을 실행할 수 있게 열어둔 창구
app.use(`/api/user`, userAPIRouter);
app.use(`/api/post`, postAPIRouter);
app.use(`/api/posts`, postsAPIRouter);
app.use(`/api/hashtag`, hashtagAPIRouter);

app.listen(PORT, () =>
  console.log(`server is running on http://localhost:${PORT}`)
);
