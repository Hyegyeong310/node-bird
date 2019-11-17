import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Avatar, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "../components/PostCard";
import { LOAD_USER_POSTS_REQUEST } from "../reducers/post";
import { LOAD_USER_REQUEST } from "../reducers/user";

const User = ({ id }) => {
  const dispatch = useDispatch();
  const { mainPosts } = useSelector(state => state.post);
  const { userInfo } = useSelector(state => state.user);
  useEffect(() => {
    dispatch({
      type: LOAD_USER_REQUEST,
      data: id
    });
    dispatch({
      type: LOAD_USER_POSTS_REQUEST,
      data: id
    });
  }, []);
  return (
    <div>
      {userInfo ? (
        <Card
          actions={[
            <div key="twit">
              짹짹
              <br />
              {userInfo.Posts}
            </div>,
            <div key="following">
              팔로잉
              <br />
              {userInfo.Followings}
            </div>,
            <div key="follower">
              팔로워
              <br />
              {userInfo.Followers}
            </div>
          ]}
        >
          <Card.Meta
            avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
            title={userInfo.nickname}
          />
        </Card>
      ) : null}
      {mainPosts.map(c => (
        <PostCard key={+c.createdAt} post={c} />
      ))}
    </div>
  );
};

User.propTyeps = {
  id: PropTypes.number.isRequired
};

// 가장 처음으로 실행되는 라이프사이클 메서드
User.getInitialProps = async context => {
  console.log(context.query.id);
  return { id: parseInt(context.query.id, 10) }; // server쪽 data를 prop로 넘길 수 있음.
};

export default User;
