import React, { useCallback } from 'react';
import Link from 'next/link';
import { Button, Form, Input } from 'antd';
import { useInput } from '../pages/signup';

const LoginForm = () => {
  const [id, onChangeId] = useInput('');
  const [password, onChangePassword] = useInput('');
  const onSubmitForm = useCallback(
    e => {
      e.preventDefault();
      console.log({
        id,
        password
      });
    },
    [id, password]
  );

  return (
    <Form onSubmit={onSubmitForm}>
      <div>
        <label htmlFor="user-id">아이디</label>
        <br />
        <Input
          value={id}
          onChange={onChangeId}
          name="user-id"
          type="text"
          required
        />
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input
          value={password}
          onChange={onChangePassword}
          name="user-password"
          type="password"
          required
        />
      </div>
      <div>
        <Button type="primary" htmlType="submit" loading={false}>
          로그인
        </Button>
        <Link href="/signup">
          <a>
            <Button>회원가입</Button>
          </a>
        </Link>
      </div>
    </Form>
  );
};

export default LoginForm;
