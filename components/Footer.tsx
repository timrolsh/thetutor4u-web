/*
 For now, all this footer has is the logo and the copyright statement
 */

import React from "react";
import styles from "../styles/Footer.module.css";
import Image from "next/image";

function Footer(): JSX.Element {
    const imageSize: string = "45%";
    return (
        <>
            <div id={styles["row"]}>
                <Image
                    src={"/images/logo-no-text.png"}
                    alt={"Logo no text"}
                    width={imageSize}
                    height={imageSize}
                ></Image>
                ©2022, TheTutor4U, LLC.
            </div>
        </>
    );
}

export default Footer;
