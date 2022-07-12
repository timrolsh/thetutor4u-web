import React from "react";

import Header from "./Header";
import Footer from "./Footer";



function Homepage() {
    return (
        <>
            <Header signedIn={false} />

            <Footer />
        </>
    );
}

export default Homepage;
