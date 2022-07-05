import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserProvider } from "@auth0/nextjs-auth0";

import Head from "next/head";

export default function App({ Component, pageProps }) {
    return (
        <UserProvider>
            {/* put here in case browser doesn't make automatic request for favicon */}
            <Head>
                <link rel="icon" href="/favicon.ico"></link>
            </Head>
            <Component {...pageProps} />
        </UserProvider>
    );
}
