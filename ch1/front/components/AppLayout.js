import React, { useEffect } from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import { Col, Input, Menu, Row } from "antd";
import { useSelector, useDispatch } from "react-redux";
import LoginForm from "../components/LoginForm";
import UserProfile from "../components/UserProfile";
import { LOAD_USER_REQUEST } from "../reducers/user";

const AppLayout = ({ children }) => {
  const { me } = useSelector(state => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!me) {
      dispatch({
        type: LOAD_USER_REQUEST
      });
    }
  }, []);
  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="home">
          <Link href="/">
            <a>노드버드</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="profile">
          <Link href="/profile">
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="mail">
          <Input.Search enterButton style={{ verticalAlign: "middle" }} />
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={6}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <Link href="https://blog.hyegyeong.com/">
            <a target="_blank">Made by Betty</a>
          </Link>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node
};

export default AppLayout;
