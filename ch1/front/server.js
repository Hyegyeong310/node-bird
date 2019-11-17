const express = require("express");
const next = require("next");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const dotenv = require("dotenv");

dotenv.config();
const dev = process.env.NODE_ENV !== "production";
const prod = process.env.NODE_ENV === "production";
const PORT = process.env.PORT;

const app = next({
  dev
});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(morgan("dev"));
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(cookieParser(process.env.COOKIE_SECRET));
  server.use(
    expressSession({
      resave: false,
      saveUninitialized: false,
      secret: "",
      cookie: {
        httpOnly: true,
        secure: false
      }
    })
  );

  server.get("/hashtag/:tag", (req, res) => {
    return app.render(req, res, "/hashtag", { tag: req.params.tag });
  });

  server.get("/user/:id", (req, res) => {
    return app.render(req, res, "/user", { id: req.params.id });
  });

  // * -> 모든 get 요청을 처리
  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, () => {
    console.log(`next+express running on port ${PORT}`);
  });
});
