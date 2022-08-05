import {UserProfile} from "@auth0/nextjs-auth0";
import db from "./ConnectDatabase";

/*
Scans database for user, if user does not exist, creates a new user. WIll not be used in production, auth0 hooks
will be used to update the database after user registration. */
function updateDbUser(user: UserProfile): void {
    db.query({
        text: "select * from thetutor4u.user where id = '$1::text';",
        values: [user.sub]
    }).then((response) => {
        console.log(response);
    });
}

export default updateDbUser;
