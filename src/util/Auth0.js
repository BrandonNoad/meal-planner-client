import { WebAuth } from 'auth0-js';
import _has from 'lodash/has';

let webAuth = null;

const getWebAuth = () => {
    if (webAuth === null) {
        webAuth = new WebAuth({
            domain: process.env.GATSBY_AUTH0_DOMAIN,
            clientID: process.env.GATSBY_AUTH0_CLIENT_ID,
            redirectUri: `${process.env.GATSBY_BASE_URL}/app/auth0/login`,
            scope: 'openid email profile',
            audience: process.env.GATSBY_AUTH0_AUDIENCE,
            responseType: 'token id_token'
        });
    }

    return webAuth;
};

export const logIn = () => getWebAuth().authorize();

export const logOut = () =>
    getWebAuth().logout({
        returnTo: `${process.env.GATSBY_BASE_URL}/app/auth0/logout`
    });

export const fetchSession = () =>
    new Promise((resolve, reject) => {
        getWebAuth().checkSession({ timeout: 5000 }, (err, authResult) => {
            if (err) {
                console.log(err);
                // If the user is not authenticated, you will receive an error like this:
                // { error: 'login_required' }
                const { error } = err;

                if (error !== 'login_required') {
                    // TODO: handle this case
                    // return reject(err);
                }

                // No authResult
                return resolve(null);
            }

            const session = _has(authResult, 'accessToken') ? authResult : null;

            return resolve(session);
        });
    });
