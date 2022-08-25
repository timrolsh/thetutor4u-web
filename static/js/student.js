import {getTokenInfo} from "get-user";
document.getElementById("welcome").innerHTML += " " + getTokenInfo().name;
