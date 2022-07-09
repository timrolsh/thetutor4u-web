import React from "react";
import {Container} from "react-bootstrap";

import Header from "./Header";

//TODO implement the rest of the home page

function Homepage() {
    return (
        <>
            {/* didn't put the header in a container because there were border issues even though container was set to fluid */}
            <Header signedIn={false}></Header>
            <Container fluid></Container>
        </>
    );
}

export default Homepage;
