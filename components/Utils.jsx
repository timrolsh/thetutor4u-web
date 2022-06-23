import React from "react";
import Image from "next/image";

export default function Logo() {
    return (
        <Image
            src="/images/logo.png"
            width={150}
            height={150}
            alt="TheTutor4u Logo"
        ></Image>
    );
}
