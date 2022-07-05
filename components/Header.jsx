/* 
This header will be at the top of every page of the website, and its appearence will change based on what page of the website the user is on
Navigation bar layout:
* Left: Hamburger Menu
    * Icon Appearence: the appearence of the Hamburger Menu will always be the 3 lines no matter what
    * Hamburger Menu Content (In Order)
        - Dashboard (if you are signed in)
        - Calendar (if you are signed in)
        - About page for all parts of the website
* Center: TheTutor4U Logo that includes the text
* Right: Account Hamburger Menu
    * Icon Appearence
        - Not Signed in Button when on not signed in
        - User's profile picture when signed in
    * Hamburger Menu Content (In Order)
        - Sign Up (if not signed in)
        - Sign In (if not signed in)
        - Profile (if signed in)
        - Settings (if signed in)
*/

// TODO get higher quality resolution image for Thetutor4u logo from snes dad
// TODO implement the rest of the header component

import React from "react";
import styles from "../styles/Header.module.css";
import { Container, Navbar } from "react-bootstrap";

export default () => {
    return (
        <Navbar id={styles["header"]}>
            <Container fluid>
			// TODO continue working from here
            </Container>
        </Navbar>
    );
};
