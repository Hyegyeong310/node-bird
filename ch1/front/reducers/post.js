export const initialState = {
  mainPosts: [
    {
      id: 1,
      User: {
        id: 1,
        nickname: "베티"
      },
      content: "first post",
      img:
        "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
      Comments: []
    } // 화면에 보일 포스트들
  ],
  imagePaths: [], // 미리보기 이미지 경로
  addPostErrorReason: "", // 포스트 업로드 실패 사유
  isAddingPost: false, //포스트 업로드 중
  postAdded: false, // 포스트 업로드 성공
  isAddingComment: false,
  addCommentErrorReason: "",
  commentAdded: false
};

const dummyPost = {
  id: 2,
  User: {
    id: 1,
    nickname: "betty"
  },
  content: "나는 더미입니다.",
  Comments: []
};

const dummyComment = {
  id: 1,
  User: {
    id: 1,
    nickname: "bbb"
  },
  createdAt: new Date(),
  content: "더미 댓글입니다."
};

// 메인 포스트 로딩 액션
export const LOAD_MAIN_POSTS_REQUEST = "LOAD_MAIN_POSTS_REQUEST";
export const LOAD_MAIN_POSTS_SUCCESS = "LOAD_MAIN_POSTS_SUCCESS";
export const LOAD_MAIN_POSTS_FAILURE = "LOAD_MAIN_POSTS_FAILURE";

// 해쉬태그에 해당하는 포스트 로딩 액션
export const LOAD_HASHTAG_POSTS_REQUEST = "LOAD_HASHTAG_POSTS_REQUEST";
export const LOAD_HASHTAG_POSTS_SUCCESS = "LOAD_HASHTAG_POSTS_SUCCESS";
export const LOAD_HASHTAG_POSTS_FAILURE = "LOAD_HASHTAG_POSTS_FAILURE";

// 유저 포스트 로딩 액션
export const LOAD_USER_POSTS_REQUEST = "LOAD_USER_POSTS_REQUEST";
export const LOAD_USER_POSTS_SUCCESS = "LOAD_USER_POSTS_SUCCESS";
export const LOAD_USER_POSTS_FAILURE = "LOAD_USER_POSTS_FAILURE";

// 이미지 삭제 액션
export const REMOVE_IMAGE = "REMOVE_IMAGE"; // 동기적으로 제거 가능

// 이미지 업로드 액션
export const UPLOAD_IMAGES_REQUEST = "UPLOAD_IMAGES_REQUEST";
export const UPLOAD_IMAGES_SUCCESS = "UPLOAD_IMAGES_SUCCESS";
export const UPLOAD_IMAGES_FAILURE = "UPLOAD_IMAGES_FAILURE";

// 포스트 추가 액션
export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

// 라이크 액션
export const LIKE_POST_REQUEST = "LIKE_POST_REQUEST";
export const LIKE_POST_SUCCESS = "LIKE_POST_SUCCESS";
export const LIKE_POST_FAILURE = "LIKE_POST_FAILURE";

// 언라이크 액션
export const UNLIKE_POST_REQUEST = "UNLIKE_POST_REQUEST";
export const UNLIKE_POST_SUCCESS = "UNLIKE_POST_SUCCESS";
export const UNLIKE_POST_FAILURE = "UNLIKE_POST_FAILURE";

// 댓글 추가 액션
export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

// 댓글 로딩 액션
export const LOAD_COMMENTS_REQUEST = "LOAD_COMMENTS_REQUEST";
export const LOAD_COMMENTS_SUCCESS = "LOAD_COMMENTS_SUCCESS";
export const LOAD_COMMENTS_FAILURE = "LOAD_COMMENTS_FAILURE";

// 리트윗 액션
export const RETWEET_REQUEST = "RETWEET_REQUEST";
export const RETWEET_SUCCESS = "RETWEET_SUCCESS";
export const RETWEET_FAILURE = "RETWEET_FAILURE";

// 포스트 삭제 액션
export const REMOVE_POST_REQUEST = "REMOVE_POST_REQUEST";
export const REMOVE_POST_SUCCESS = "REMOVE_POST_SUCCESS";
export const REMOVE_POST_FAILURE = "REMOVE_POST_FAILURE";

// TODO: POST 수정 액션

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_MAIN_POSTS_REQUEST:
      return { ...state };
    case LOAD_MAIN_POSTS_SUCCESS:
      return { ...state };
    case LOAD_MAIN_POSTS_FAILURE:
      return { ...state };

    case ADD_POST_REQUEST:
      return {
        ...state,
        isAddingPost: true,
        addPostErrorReason: "",
        postAdded: false
      };
    case ADD_POST_SUCCESS:
      return {
        ...state,
        isAddingPost: false,
        mainPosts: [dummyPost, ...state.mainPosts],
        postAdded: true
      };
    case ADD_POST_FAILURE:
      return {
        ...state,
        isAddingPost: false,
        addPostErrorReason: action.error
      };

    case ADD_COMMENT_REQUEST:
      return {
        ...state,
        isAddingComment: true,
        addCommentErrorReason: "",
        commentAdded: false
      };
    case ADD_COMMENT_SUCCESS:
      const postIndex = state.mainPosts.findIndex(
        v => v.id === action.data.postId
      );
      const post = state.mainPosts[postIndex];
      const Comments = [...post.Comments, dummyComment];
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, Comments };
      return {
        ...state,
        isAddingComment: false,
        mainPosts,
        commentAdded: true
      };
    case ADD_COMMENT_FAILURE:
      return {
        ...state,
        isAddingComment: false,
        addCommentErrorReason: action.error
      };
    default:
      return state;
  }
};

export default reducer;
