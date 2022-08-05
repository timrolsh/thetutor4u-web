import React from "react";
import {useUser} from "@auth0/nextjs-auth0";
import Dashboard from "../components/Dashboard";
import Homepage from "../components/Homepage";

function Index(): JSX.Element {
    const {user} = useUser();
    // if the user is signed in, render the dashboard component
    if (user) {
        return <Dashboard />;
    }
    return <Homepage />;
}

export default Index;
