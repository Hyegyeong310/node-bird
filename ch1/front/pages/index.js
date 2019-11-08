import React, { useEffect } from 'react';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { useSelector } from 'react-redux';

const Home = () => {
  const { isLoggedIn, user } = useSelector(state => state.user);
  const { mainPosts } = useSelector(state => state.post);

  return (
    <>
      <div>
        {user ? (
          <div>로그인 했습니다: {user.nickname}</div>
        ) : (
          <div>로그아웃 했습니다.</div>
        )}
        {isLoggedIn && <PostForm />}
        {mainPosts.map((c, i) => {
          return <PostCard key={i} post={c} />;
        })}
      </div>
    </>
  );
};

{
  /*
// == useSelector
const mapStateToProps = state => {
  return { user: state.user };
};
 */
}

{
  /* 
// == useDispatch
const mapDispatchToProps = dispatch => {
  return {
    login: () => dispatch(loginAction),
    logout: () => dispatch(logoutAction)
  };
};
*/
}

export default Home;
