import { all, delay, fork, put, takeEvery, take } from "redux-saga/effects";
import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE
} from "../reducers/user";
import axios from "axios";

/*
for (let i = 0; i < 5; i++) {
    // yield로 인해 무한 반복하지만 yield가 실행되야 다음 호출이 가능함. 보통의 무한루프와 다르다.
    yield take(HELLO_SAGA);
    console.log('after saga');
  }
*/

function loginAPI() {
  // TODO: 서버에 요청 보내는 부분
  console.log("loginAPI");
  // return axios.post("/login");
}

function* login() {
  try {
    // yield fork(loginAPI); // 내 기록을 로깅하는 함수. 10초 걸린다. 콘솔에 찍히기만 하면 되는 역할. 부가적인 기능일 때 `fork`!

    // call: api를 성공적으로 불러온 후 실행. -> 동기적으로 무조건 순서를 지켜야할 때 (로그인, api 데이터 받는 등)
    // yield call(loginAPI);
    yield delay(2000);
    yield put({
      // dispatch의 역할
      type: LOG_IN_SUCCESS
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

function signUpAPI() {
  // TODO: 서버에 요청 보내는 부분
  console.log("signUpAPI");
  // return axios.post("/signup");
}

function* signUp() {
  try {
    // yield call(signUpAPI);
    yield delay(2000);
    throw new Error("eihgiehig");
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
  yield all([fork(watchLogin), fork(watchSignUp)]); // -> fork: 비동기적으로 실행. 순서 실행에 대해 의미가 없다.
}
