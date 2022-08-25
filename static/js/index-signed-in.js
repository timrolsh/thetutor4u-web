import {getTokenInfo} from "get-user";

const user = getTokenInfo();
document.getElementById("welcome").innerHTML += user.name;
