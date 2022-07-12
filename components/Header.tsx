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

import React from "react";
import styles from "../styles/Header.module.css";
import Link from "next/link";

/*
this function returns the Page Navigation as a horizontal list of links to pages across the website, which will be
different based on whether the user is logged in or not
 */
function PageNavigationAsList(props: {signedIn: boolean}): JSX.Element {
    function ListLink(listLinkProps: {href: string; text: string}): JSX.Element {
        return (
            <div className={styles["text-container"]}>
                <Link href={listLinkProps.href}>{listLinkProps.text}</Link>
            </div>
        );
    }

    if (props.signedIn) {
        return (
            <>
                <ListLink href={"/dashboard"} text={"Dashboard"} />
                <ListLink href={"/calendar"} text={"Calendar"} />
                <ListLink href={"/balance"} text={"Balance"} />
                <ListLink href={"/about"} text={"About"} />
            </>
        );
    }
    return (
        <>
            <ListLink href={"/about"} text={"About"} />
        </>
    );
}

// TODO implement two components, one that has then all laid out and another one with the hamburger menu
// you can use screen.width to get the size of the screen directly from the JS DOM
function Header(props: {signedIn: boolean}): JSX.Element {
    return (
        <>
            <div id={styles["top-row"]}>
                <div id={styles["left-container"]}>
                    {/*<PageNavigationAsList signedIn={props.signedIn} />*/}
                    <PageNavigationAsList signedIn={true} />
                </div>
                <div id={styles["center-container"]}>
                    <img src="/images/logo.png" alt="Logo with text"></img>
                </div>
                <div id={styles["right-container"]}>
                    <img src="/images/not-signed-in.png" alt="Not Signed In"></img>
                </div>
            </div>
        </>
    );
}

export default Header;
