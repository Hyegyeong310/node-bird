import React from "react";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { useSelector } from "react-redux";

const Home = () => {
  const { me } = useSelector(state => state.user);
  const { mainPosts } = useSelector(state => state.post);
  return (
    <>
      <div>
        {me ? (
          <div>로그인 했습니다: {me.nickname}</div>
        ) : (
          <div>로그아웃 했습니다.</div>
        )}
        {me && <PostForm />}
        {mainPosts.map((c, i) => (
          <PostCard key={i} post={c} />
        ))}
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
