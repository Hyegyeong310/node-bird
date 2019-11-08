import React from 'react';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';

// _app.js는 공동 레이아웃으로 사용됌.
// 최초 1번만 로딩
const NodeBird = ({ Component }) => {
  return (
    <>
      <Head>
        <title>NodeBird</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.23.6/antd.css"
        />
      </Head>
      <AppLayout>
        <Component />
      </AppLayout>
    </>
  );
};

export default NodeBird;
