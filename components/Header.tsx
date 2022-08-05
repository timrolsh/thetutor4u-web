/*
This header will be at the top of every page of the website, and its appearance will change based on what page of the
website the user is on: This is specified in the _app.tsx file, no need to put this component and the footer component
in every page manually.
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

import React from "react";
import styles from "../styles/Header.module.css";
import {Dropdown} from "react-bootstrap";

/*
this function returns the Page Navigation as a horizontal list of links to pages across the website, which will be
different based on whether the user is logged in or not
 */
function NavigationMenu(props: {signedIn: boolean}): JSX.Element {
    function ListItem(ListItemProps: {href: string; class: string; text: string; listItems: number}): JSX.Element {
        return (
            <li style={{width: `${(1 / ListItemProps.listItems) * 100}%`}} className={styles["li"]}>
                <a href={ListItemProps.href}>
                    <i className={ListItemProps.class}></i>
                    <span>{ListItemProps.text}</span>
                </a>
            </li>
        );
    }

    function List(): JSX.Element {
        if (props.signedIn) {
            const items: number = 4;
            return (
                <>
                    <ListItem listItems={items} href={"/"} class={"fa fa-id-card"} text={"Dashboard"} />
                    <ListItem listItems={items} href={"/calendar"} class={"fa fa-calendar-check"} text={"Calendar"} />
                    <ListItem listItems={items} href={"/balance"} class={"fa fa-credit-card"} text={"Balance"} />
                    <ListItem listItems={items} href={"/about"} class={"fa fa-info"} text={"About"} />
                </>
            );
        }
        const items: number = 1;
        return (
            <>
                <ListItem listItems={items} href={"/about"} class={"fa fa-info"} text={"About"} />
            </>
        );
    }

    return (
        <>
            <div id={styles["navigation-bar"]}>
                <ul>
                    <List />
                </ul>
            </div>
        </>
    );
}

function SignedInMenu(props: {signedIn: boolean}): JSX.Element {
    function Items(): JSX.Element {
        if (props.signedIn) {
            return (
                <>
                    <Dropdown.Item href="#/action-1">Profile</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Settings</Dropdown.Item>
                </>
            );
        }
        return (
            <>
                <Dropdown.Item href="#/action-1">Sign In</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Sign Up</Dropdown.Item>
            </>
        );
    }
    return (
        <>
            <Dropdown>
                <Dropdown.Toggle id={styles["sign-in-button"]}>
                    <img src="/images/not-signed-in.png" alt={"Not Signed In"}></img>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Items />
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
}

function Header(props: {signedIn: boolean}): JSX.Element {
    return (
        <>
            <div id={styles["top-row"]}>
                <NavigationMenu signedIn={props.signedIn} />
                <div id={styles["center-container"]}>
                    <a href="/">
                        <img src="/images/logo.png" alt="Logo with text"></img>
                    </a>
                </div>
                <div id={styles["right-container"]}>
                    <SignedInMenu signedIn={props.signedIn} />
                </div>
            </div>
        </>
    );
}

export default Header;
