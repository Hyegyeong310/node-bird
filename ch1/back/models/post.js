module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post", // 테이블명은 posts
    {
      content: {
        type: DataTypes.STRING(140), // TEXT - 매우 긴 글
        allowNull: false
      }
    },
    {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci" // 한글 + 이모티콘 가능
    }
  );

  Post.associate = db => {
    // Post는 User에 속해있다. belongsTo가 있는 테이블의 다른 테이블의 Id 저장.(Post 테이블에 UserId 저장)
    db.Post.belongsTo(db.User);
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    db.Post.belongsTo(db.Post, { as: "Retweet" });
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" });
    db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" });
  };

  return Post;
};
