import {getTokenInfo} from "/js/get-user.js";
document.getElementById("welcome").innerHTML += ` ${getTokenInfo().name}`;
