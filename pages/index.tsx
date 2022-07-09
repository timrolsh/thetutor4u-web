import React from "react";
import Dashboard from "../components/Dashboard";
import Homepage from "../components/Homepage";
import isLoggedIn from "../ts/isLoggedIn";

// TODO get login to work with auth0, not being logged in brings you to home page, logged in brings you to dashboard page

// if the user is logged in, render the dashboard, otherwise if the user is not logged in, render the standard homepage which will allow them to log in
function index(): JSX.Element {
    if (isLoggedIn()) {
        return <Dashboard></Dashboard>;
    }
    return <Homepage></Homepage>;
}

export default index;
