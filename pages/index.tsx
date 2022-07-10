import React from "react";
import Dashboard from "../components/Dashboard";
import Homepage from "../components/Homepage";
import isLoggedIn from "../ts/isLoggedIn";

// TODO get login to work with auth0, not being logged in brings you to home page, logged in brings you to dashboard page

// if the user is logged in and goes to the home page, redirect them to the /dashboard page
function index(): JSX.Element {
    if (isLoggedIn()) {
        return <Dashboard />;
    }
    return <Homepage />;
}

export default index;
