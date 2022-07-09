/* 
This header will be at the top of every page of the website, and its appearance will change based on what page of the website the user is on
Navigation bar layout:
* Left: Hamburger Menu
    * Icon Appearance: the appearance of the Hamburger Menu will always be the 3 lines no matter what
    * Hamburger Menu Content (In Order)
        - Dashboard (if you are signed in)
        - Calendar (if you are signed in)
        - About page for all parts of the website
* Center: TheTutor4U Logo that includes the text
* Right: Account Hamburger Menu
    * Icon Appearance
        - Not Signed in Button when on not signed in
        - User's profile picture when signed in
    * Hamburger Menu Content (In Order)
        - Sign Up (if not signed in)
        - Sign In (if not signed in)
        - Profile (if signed in)
        - Settings (if signed in)
*/

// TODO implement the rest of the header component

import React from "react";
import styles from "../styles/Header.module.css";
import {Dropdown, Container, Nav} from "react-bootstrap";
import Image from "next/image";

const hamburgerMenuSize: number = 35;

// this row will always be in the hamburger menu, when the user is signed in and when they are not signed in
function AboutRow(): JSX.Element {
    return <Dropdown.Item>About</Dropdown.Item>;
}

// these rows should only be rendered when the user is signed in to the app
function SignedInRows(): JSX.Element {
    return (
        <>
            <Dropdown.Item>Dashboard</Dropdown.Item>
            <Dropdown.Item>Calendar</Dropdown.Item>
        </>
    );
}

interface HeaderProps {
    signedIn: boolean;
}

function Header(props: HeaderProps): JSX.Element {
    function DashboardRows(): JSX.Element {
        if (!props.signedIn) {
            return <AboutRow></AboutRow>;
        }
        return (
            <>
                <SignedInRows></SignedInRows>
                <AboutRow></AboutRow>
            </>
        );
    }

    return (
        <>
            {/* navbar that will be at the top of the page */}
            <Nav id={styles["header"]}>
                <Container fluid>
                    {/* hamburger menu on the left */}
                    <Dropdown>
                        <Dropdown.Toggle id={styles["hamburger-menu-outer"]}>
                            <Image
                                src={"/images/hamburger-menu.png"}
                                width={hamburgerMenuSize}
                                height={hamburgerMenuSize}
                                alt={"Hamburger Menu"}
                            ></Image>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <DashboardRows></DashboardRows>
                        </Dropdown.Menu>
                    </Dropdown>
                    {/* logo that will be in the middle of the header */}

                    <div className="text-center">
                        <Image
                            src="/images/logo.png"
                            width={200}
                            height={100}
                            alt="TheTutor4U Logo"
                        ></Image>
                    </div>
                </Container>
            </Nav>
        </>
    );
}

export default Header;
