import { all, delay, fork, put, takeEvery, call } from "redux-saga/effects";
import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAILURE
} from "../reducers/user";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3065/api";

/*
for (let i = 0; i < 5; i++) {
    // yield로 인해 무한 반복하지만 yield가 실행되야 다음 호출이 가능함. 보통의 무한루프와 다르다.
    yield take(HELLO_SAGA);
    console.log('after saga');
  }
*/

function loginAPI(loginData) {
  // TODO: 서버에 요청 보내는 부분
  return axios.post("/user/login", loginData, {
    withCredentials: true
  });
}

function* login(action) {
  try {
    // yield fork(loginAPI); // 내 기록을 로깅하는 함수. 10초 걸린다. 콘솔에 찍히기만 하면 되는 역할. 부가적인 기능일 때 `fork`!

    // call: api를 성공적으로 불러온 후 실행. -> 동기적으로 무조건 순서를 지켜야할 때 (로그인, api 데이터 받는 등)
    const { data } = yield call(loginAPI, action.data);
    yield put({
      // dispatch의 역할
      type: LOG_IN_SUCCESS,
      data
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOG_IN_FAILURE
    });
  }
}

function* watchLogin() {
  yield takeEvery(LOG_IN_REQUEST, login);
}

function signUpAPI(signUpData) {
  // TODO: 서버에 요청 보내는 부분
  return axios.post("/user", signUpData);
}

function* signUp(action) {
  try {
    yield call(signUpAPI, action.data);
    yield put({
      type: SIGN_UP_SUCCESS
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: SIGN_UP_FAILURE,
      error: e
    });
  }
}

function* watchSignUp() {
  yield takeEvery(SIGN_UP_REQUEST, signUp);
}

function logoutAPI() {
  return axios.post(
    "/user/logout",
    {},
    {
      withCredentials: true
    }
  );
}

function* logout() {
  try {
    yield call(logoutAPI);
    yield put({
      type: LOG_OUT_SUCCESS
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOG_OUT_FAILURE,
      error: e
    });
  }
}

function* watchLogout() {
  yield takeEvery(LOG_OUT_REQUEST, logout);
}

function loadUserAPI() {
  // 처음에 쿠키로 내 정보를 가져오는 부분
  return axios.get("/user", {
    withCredentials: true
  });
}

function* loadUser() {
  try {
    const { data } = yield call(loadUserAPI);
    yield put({
      type: LOAD_USER_SUCCESS,
      data
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_USER_FAILURE,
      error: e
    });
  }
}

function* watchLoadUser() {
  yield takeEvery(LOAD_USER_REQUEST, loadUser);
}

/*
function* hello() {
  yield delay(1000);
  yield put({
    type: "BYE_SAGA"
  });
}
  
const HELLO_SAGA = "HELLO_SAGA";
function* watchHello() {
  // takeLatest: 이전 요청이 끝나지 않았다면 이전 요청을 취소한다. 로그인 시 실수로 2번 클릭했을 때
  // takeEvery:  이전 요청과 연결된 모든 요청을 실행 뒤 다음 요청을 실행한다
  yield takeLatest(HELLO_SAGA, hello);
}
*/

// function* watchHello() {
//   while (true) {
//     yield take(HELLO_SAGA);
//     console.log(1);
//     console.log(2);
//     console.log(3);
//     console.log(4);
//   }
// }

export default function* userSaga() {
  yield all([
    fork(watchLogin),
    fork(watchLogout),
    fork(watchLoadUser),
    fork(watchSignUp)
  ]); // -> fork: 비동기적으로 실행. 순서 실행에 대해 의미가 없다.
}
