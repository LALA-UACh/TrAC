import "react-toastify/dist/ReactToastify.min.css";

import App from "next/app";
import Head from "next/head";
import { ToastContainer } from "react-toastify";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Head>
          <title>TrAC UACh</title>
        </Head>
        <Component {...pageProps} />
        <ToastContainer toastClassName="toastFont" />
      </>
    );
  }
}

export default MyApp;
