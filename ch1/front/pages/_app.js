import React from "react";
import { Provider } from "react-redux";
import { createStore, compose, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import Head from "next/head";
import withRedux from "next-redux-wrapper";
import PropTypes from "prop-types";

import AppLayout from "../components/AppLayout";
import reducer from "../reducers";
import rootSage from "../sagas";

// _app.js는 공동 레이아웃으로 사용됌.
// root 담당
// 최초 1번만 로딩

const NodeBird = ({ Component, store, pageProps }) => (
  <Provider store={store}>
    <Head>
      <title>NodeBird</title>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.23.6/antd.css"
      />
    </Head>
    <AppLayout>
      <Component {...pageProps} />
    </AppLayout>
  </Provider>
);

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
  store: PropTypes.object.isRequired,
  pageProps: PropTypes.object.isRequired
};

NodeBird.getInitialProps = async context => {
  const { ctx, Component } = context;
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  return { pageProps };
};

const configureStore = (initialState, options) => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];
  const enhancer =
    process.env.NODE_ENV === "production"
      ? compose(applyMiddleware(...middlewares))
      : compose(
          applyMiddleware(...middlewares),
          !options.isServer &&
            typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined"
            ? window.__REDUX_DEVTOOLS_EXTENSION__()
            : f => f
        );
  const store = createStore(reducer, initialState, enhancer);
  sagaMiddleware.run(rootSage);
  return store;
};

export default withRedux(configureStore)(NodeBird);
