import Document, { Head, Html, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document<{ styleTags: JSX.Element[] }> {
  render() {
    return (
      <Html>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          />
          <link
            rel="stylesheet"
            href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Source+Sans+Pro&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://unpkg.com/tippy.js@4/themes/light.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/css/estilo.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/css/tooltipster.bundle.min.css"
          />

          <script type="text/javascript" src="/static/js/jquery-3.2.1.min.js" />
          <script
            type="text/javascript"
            src="/static/js/tooltipster.bundle.min.js"
          />
          {this.props.styleTags}
          <meta charSet="utf-8" />
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/favicon.ico"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async ({ renderPage }) => {
  const sheet = new ServerStyleSheet();

  try {
    const page = renderPage((App: any) => (props: any) =>
      sheet.collectStyles(<App {...props} />)
    );

    const styleTags = sheet.getStyleElement();

    return { ...page, styleTags };
  } finally {
    sheet.seal();
  }
};
