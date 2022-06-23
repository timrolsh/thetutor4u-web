// include this at the top of all jsx files that represent actual pages
import "bootstrap/dist/css/bootstrap.min.css";
import Head from "next/head";

export default function MyApp({ Component, pageProps }) {
    return (
        <div>
            {/* this will put the the logo and the same head on top of all the different pages accross the website */}
            <Head>
                <title>TheTutor4U</title>
                <link rel="icon" href="/favicon.ico"></link>
            </Head>
            <Component {...pageProps} />
        </div>
    );
}
