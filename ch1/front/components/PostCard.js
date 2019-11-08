import React from 'react';
import { Avatar, Button, Card, Icon } from 'antd';
import PropTypes from 'prop-types';

const PostCard = ({ post }) => {
  return (
    <Card
      key={+post.createdAt}
      cover={post.img && <img alt="example" src={post.img} />}
      actions={[
        <Icon type="retweet" key="retweet" />,
        <Icon type="heart" key="heart" />,
        <Icon type="message" key="message" />,
        <Icon type="ellipsis" key="ellipsis" />
      ]}
      extra={<Button>팔로우</Button>}
    >
      <Card.Meta
        avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
        title={post.User.nickname}
        description={post.content}
      />
    </Card>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    createdAt: PropTypes.object,
    img: PropTypes.string,
    User: PropTypes.shape({
      nickname: PropTypes.string
    }),
    content: PropTypes.string
  })
};

export default PostCard;
