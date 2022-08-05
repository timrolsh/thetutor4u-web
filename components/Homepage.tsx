import React from "react";
import Header from "./Header";

function Homepage() {
    return (
        <>
            <Header signedIn={false} />
            <a href="/api/auth/login">Login</a>
            <a href="/api/auth/login/?screen_hint=signup">Signup</a>
        </>
    );
}

export default Homepage;
