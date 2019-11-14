import React, { useState, useCallback, useEffect } from "react";
// import PropTypes from 'prop-types';
import { Form, Input, Checkbox, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";
import { SIGN_UP_REQUEST } from "../reducers/user";

/*
// input component 최적화
// memo() => 컴퍼넌트를 렌더링하고 결과를 메모이징(Memoizing)한다. 다음 렌더링이 일어날 때 props가 같다면, React는 메모이징(Memoizing)된 내용을 재사용
const TextInput = memo(({ value, onChange }) => {
  return <Input name="user-id" value={value} required onChange={onChange} />;
});


TextInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
};
*/

const targetValue = e => {
  const {
    target: { value }
  } = e;
  return value;
};

// custom hook
export const useInput = (initValue = null) => {
  const [value, setter] = useState(initValue);
  const handler = useCallback(e => {
    setter(e.target.value);
  }, []);
  return [value, handler];
};

const Signup = () => {
  const [id, setId] = useState("");
  const [nick, setNick] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [term, setTerm] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [termError, setTermError] = useState(false);
  const { isSigningUp, me } = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (me) {
      alert("로그인 성공! 메인페이지로 이동합니다.");
      Router.push("/");
    }
  }, [me && me.id]); // useEffect deps는 객체를 넣으면 비교가 힘드므로 객체 안의 값을 넣는다.

  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      if (password !== passwordCheck) {
        return setPasswordError(true);
      }
      if (!term) {
        return setTermError(true);
      }
      dispatch({
        type: SIGN_UP_REQUEST,
        data: {
          userId: id,
          password,
          nickname: nick
        }
      });
    },
    [id, nick, password, passwordCheck, term]
  );

  const onChangeId = useCallback(e => {
    const value = targetValue(e);
    setId(value);
  }, []);

  const onChangeNick = useCallback(e => {
    const value = targetValue(e);
    setNick(value);
  }, []);

  const onChangePassword = useCallback(e => {
    const value = targetValue(e);
    setPassword(value);
  }, []);

  const onChangePasswordCheck = useCallback(
    e => {
      const value = targetValue(e);
      setPasswordError(value !== password);
      setPasswordCheck(value);
    },
    [password]
  );

  const onChangeTerm = useCallback(e => {
    setTermError(false);
    setTerm(e.target.checked);
  }, []);

  return (
    <>
      <Form onSubmit={onSubmit} style={{ padding: 10 }}>
        <div>
          <label htmlFor="user-id">아이디</label>
          <br />
          <Input name="user-id" value={id} required onChange={onChangeId} />
        </div>
        <div>
          <label htmlFor="user-nick">닉네임</label>
          <br />
          <Input
            name="user-nick"
            value={nick}
            required
            onChange={onChangeNick}
          />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <Input
            name="user-password"
            type="password"
            value={password}
            required
            onChange={onChangePassword}
          />
        </div>
        <div>
          <label htmlFor="user-password-check">비밀번호체크</label>
          <br />
          <Input
            name="user-password-check"
            type="password"
            value={passwordCheck}
            required
            onChange={onChangePasswordCheck}
          />
          {passwordError && (
            <div style={{ color: "red" }}>비밀번호가 일치하지 않습니다.</div>
          )}
        </div>
        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
            가입 약관에 동의합니다.
          </Checkbox>
          {termError && (
            <div style={{ color: "red" }}>약관에 동의하셔야 합니다.</div>
          )}
        </div>
        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit" loading={isSigningUp}>
            가입하기
          </Button>
        </div>
      </Form>
    </>
  );
};

export default Signup;
