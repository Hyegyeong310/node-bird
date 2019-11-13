import { all, call, delay, fork, takeLatest, put } from "redux-saga/effects";
import {
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_POST_FAILURE,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST
} from "../reducers/post";

function addPostAPI() {
  console.log("addPostAPI");
}

function* addPost() {
  try {
    yield call(addPostAPI);
    yield delay(2000);
    yield put({
      type: ADD_POST_SUCCESS
    });
  } catch (e) {
    yield put({
      type: ADD_POST_FAILURE,
      error: e
    });
  }
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost); // 게시글은 여러번 클릭해도 1번만 게시되어야 한다.
}

function addCommentAPI() {
  console.log("addCommentAPI");
}

function* addComment(action) {
  try {
    yield call(addCommentAPI);
    yield delay(2000);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: {
        postId: action.data.postId
      }
    });
  } catch (e) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: e
    });
  }
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment); // 게시글은 여러번 클릭해도 1번만 게시되어야 한다.
}

export default function* postSaga() {
  yield all([fork(watchAddPost), fork(watchAddComment)]);
}
