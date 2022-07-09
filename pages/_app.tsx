import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {UserProvider} from "@auth0/nextjs-auth0";
import {AppProps} from "next/app";

import Head from "next/head";

function _app({Component, pageProps}: AppProps): JSX.Element {
    return (
        <UserProvider>
            {/* put here in case browser doesn't make automatic request for favicon */}
            <Head>
                <link rel="icon" href="/favicon.ico"></link>
                <title>TheTutor4U</title>
            </Head>
            <Component {...pageProps} />
        </UserProvider>
    );
}

export default _app;
