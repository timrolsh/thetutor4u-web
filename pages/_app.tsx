import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {AppProps} from "next/app";

import Head from "next/head";
import { SSRProvider } from "react-bootstrap";

function _app({Component, pageProps}: AppProps): JSX.Element {
    return (
        // development env was complaining about wrapping app in SSRProvider when server side rendering
        <SSRProvider>
            {/* put here in case browser doesn't make automatic request for favicon */}
            <Head>
                <link rel="icon" href="/favicon.ico"></link>
                <title>TheTutor4U</title>
            </Head>
            <Component {...pageProps} />
        </SSRProvider>
    );
}

export default _app;
