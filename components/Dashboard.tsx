import React from "react";

import Header from "./Header";
import {useUser} from "@auth0/nextjs-auth0";
import updateDbUser from "../ts/updateDbUser";
import { GetServerSideProps } from "next";

function Dashboard() {
    const {user} = useUser();

    return (
        <>
            <Header signedIn={true} />
            <div>Welcome to the dashboard</div>
            <a href="/api/auth/logout">Logout</a>
        </>
    );
}

export default Dashboard;

export function getServerSideProps(): GetServerSideProps {
    
    return {
        props: {

        }
    }
}

