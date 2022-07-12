import React from "react";
import {AppProps} from "next/app";

import Head from "next/head";
import Header from "../components/Header";
import isSignedIn from "../ts/isSignedIn";
import Footer from "../components/Footer";
// bootstrap global css
import "bootstrap/dist/css/bootstrap.min.css";
import {SSRProvider} from "react-bootstrap";

function _app({Component, pageProps}: AppProps): JSX.Element {
    return (
        <SSRProvider>
            {/* put here in case browser doesn't make automatic request for favicon */}
            <Head>
                <link rel="icon" href="/favicon.ico"></link>
                <title>TheTutor4U</title>
            </Head>
            <Component {...pageProps} />
            {/*put the header and footer on every page*/}
            <Header signedIn={isSignedIn()} />
            <Footer />
        </SSRProvider>
    );
}

export default _app;
