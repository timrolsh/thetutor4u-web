import React from "react";
import {AppProps} from "next/app";

import Head from "next/head";
import Footer from "../components/Footer";
// bootstrap global css
import "bootstrap/dist/css/bootstrap.min.css";
// import custom global css
import "../styles/globals.css";
import {SSRProvider} from "react-bootstrap";
import {UserProvider} from "@auth0/nextjs-auth0";

function _app({Component, pageProps}: AppProps): JSX.Element {
    return (
        <UserProvider>
            <SSRProvider>
                {/* put here in case browser doesn't make automatic request for favicon */}
                <Head>
                    <link rel="icon" href="/favicon.ico"></link>
                    <title>TheTutor4U</title>
                </Head>
                {/* cannot put header here because header takes props of whether the user is signed in or not. for now,
                put page content and then footer on every page */}
                <Component {...pageProps} />
                <Footer />
            </SSRProvider>
        </UserProvider>
    );
}

export default _app;
