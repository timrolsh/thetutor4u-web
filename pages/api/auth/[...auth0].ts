// pages/api/auth/[...auth0].js
import {handleAuth, handleLogin} from "@auth0/nextjs-auth0";
import {NextApiRequest, NextApiResponse} from "next";

export default handleAuth({
    // makes the signup link work
    async login(request: NextApiRequest, response: NextApiResponse) {
        await handleLogin(request, response, {
            authorizationParams: {
                screen_hint: "signup"
            }
        });
    }
});
