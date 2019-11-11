import { all, delay, fork, put, takeEvery, take } from 'redux-saga/effects';
import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  SIGN_UP_REQUEST
} from '../reducers/user';
import axios from 'axios';

/*
for (let i = 0; i < 5; i++) {
    // yield로 인해 무한 반복하지만 yield가 실행되야 다음 호출이 가능함. 보통의 무한루프와 다르다.
    yield take(HELLO_SAGA);
    console.log('after saga');
  }
*/

const HELLO_SAGA = 'HELLO_SAGA';

function loginAPI() {
  // TODO: 서버에 요청 보내는 부분
  console.log('loginAPI');
  return axios.post('/login');
}

function* login() {
  try {
    yield fork(logger); // 내 기록을 로깅하는 함수. 10초 걸린다.
    yield call(loginAPI); // call: api를 성공적으로 불러온 후 실행. -> 동기적으로 무조건 순서를 지켜야할 때
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
  while (true) {
    yield takeEvery(LOG_IN_REQUEST, login);
    yield delay(2000);
    yield put({
      type: LOG_IN_SUCCESS
    });
  }
}

function* watchSignUp() {
  yield take(SIGN_UP_REQUEST);
}

function* hello() {
  yield delay(1000);
  yield put({
    type: 'BYE_SAGA'
  });
}

function* watchHello() {
  // takeLatest: 이전 요청이 끝나지 않았다면 이전 요청을 취소한다. 로그인 시 실수로 2번 클릭했을 때
  // takeEvery:  이전 요청과 연결된 모든 요청을 실행 뒤 다음 요청을 실행한다
  yield takeEvery(HELLO_SAGA, hello);
}

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
  yield all([fork(watchHello), fork(watchLogin), fork(watchSignUp)]); // -> fork: 비동기적으로 실행
}
