import React from "react";
import {AppProps} from "next/app";

import Head from "next/head";

function _app({Component, pageProps}: AppProps): JSX.Element {
    return (
        <>
            {/* put here in case browser doesn't make automatic request for favicon */}
            <Head>
                <link rel="icon" href="/favicon.ico"></link>
                <title>TheTutor4U</title>
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default _app;
