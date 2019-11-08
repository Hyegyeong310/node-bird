import React from 'react';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';

const dummy = {
  isLoggedIn: true,
  imagePaths: [],
  mainPosts: [
    {
      User: {
        id: 1,
        nickname: '베티'
      },
      content: 'first post',
      img:
        'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
    }
  ]
};

const Home = () => {
  return (
    <>
      <div>
        {dummy.isLoggedIn && <PostForm />}
        {dummy.mainPosts.map((c, i) => {
          return <PostCard key={i} post={c} />;
        })}
      </div>
    </>
  );
};

export default Home;
