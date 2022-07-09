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
import {Dropdown, Container, Row} from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";

const hamburgerMenuSize: string = "50%";

interface RowLinkProps {
    rowText: string;
    href: string;
}
function RowLink(props: RowLinkProps): JSX.Element {
    const href: string = `/${props.href}`;
    return (
        <>
            <Dropdown.Item>
                <Link href={href}>
                    <a className={styles["link"]}>{props.rowText}</a>
                </Link>
            </Dropdown.Item>
        </>
    );
}

interface HeaderProps {
    signedIn: boolean;
}

function Header(props: HeaderProps): JSX.Element {
    function DashboardRows(): JSX.Element {
        if (!props.signedIn) {
            return <RowLink rowText={"About"} href={"about"} />;
        }
        return (
            <>
                <RowLink rowText={"Dashboard"} href={"dashboard"} />
                <RowLink rowText={"Calendar"} href={"calendar"} />
                <RowLink rowText={"About"} href={"about"} />
            </>
        );
    }

    function SignedInMenu(): JSX.Element {
        // if user is not signed in, return style
        if (!props.signedIn) {
            return (
                <>
                    <div className="col" id={styles["shift-right"]}>
                        <Dropdown>
                            <Dropdown.Toggle id={styles["menu-outer"]}>
                                <Image
                                    src={"/images/not-signed-in.png"}
                                    width={"200%"}
                                    height={hamburgerMenuSize}
                                    alt={"Hamburger Menu"}
                                ></Image>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {/* TODO add the proper hyperlinks to these once authentication is set up */}
                                <Dropdown.Item>Sign Up</Dropdown.Item>
                                <Dropdown.Item>Sign In</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </>
            );
        }
        return <></>;
    }

    return (
        <>
            {/* put everything in container to work with bootstrap */}
            <Container fluid={true}>
                {/* navbar that will be at the top of the page */}
                <Row id={styles["header"]}>
                    {/* using standard divs to use the col-2 bootstrap grid system */}
                    <div className="col-2">
                        <Dropdown>
                            <Dropdown.Toggle id={styles["menu-outer"]}>
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
                    </div>
                    {/* TODO dont know if there is a better way to center this image while keeping it inside the row, implementation is a little sloppy as of right now, causing cursor: pointer to show up far to the left and right from where the actual image is*/}
                    <div
                        className="col col-4 offset-2"
                        id={styles["logo-image"]}
                    >
                        <Link href="/">
                            <div className={styles["row-images"]}>
                                <Image
                                    id={styles["image-link"]}
                                    src="/images/logo.png"
                                    layout="fill"
                                    alt="TheTutor4U Logo"
                                    objectFit="contain"
                                ></Image>
                            </div>
                        </Link>
                    </div>
                    <SignedInMenu />
                </Row>
            </Container>
        </>
    );
}

export default Header;
