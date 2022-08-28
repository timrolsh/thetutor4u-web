// to use with put a script tag with the attribute type=module

/*
Returns the JWT data object from the JWT stored in the cookie
*/
export function getTokenInfo() {
    return JSON.parse(atob(document.cookie.substring(6).split(".")[1]));
}

/*
Returns the fetch promise after making the api call to /api/user-info
*/
export function getDBInfo() {
    return fetch("/api/user-info", {
        credentials: "same-origin"
    });
}
