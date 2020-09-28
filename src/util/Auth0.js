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

// https://auth0.com/docs/libraries/auth0js#using-checksession-to-acquire-new-tokens
//
// Note that checkSession() triggers any rules you may have set up, so you should check on your
// rules in the Dashboard prior to using it.
//
// The actual redirect to / authorize happens inside an iframe, so it will not reload your
// application or redirect away from it. However, the browser must have third-party cookies enabled.
// Otherwise, checkSession() is unable to access the current user's session (making it impossible to
// obtain a new token without displaying anything to the user). The same will happen if users have
// Safari's ITP enabled.
export const fetchSession = () =>
    new Promise((resolve, reject) => {
        getWebAuth().checkSession({ timeout: 5000 }, (err, authResult) => {
            if (err) {
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
