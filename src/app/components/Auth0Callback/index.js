import React, { useEffect } from 'react';
import { navigate } from 'gatsby';

const Auth0Callback = ({ auth0Action }) => {
    useEffect(() => {
        switch (auth0Action.toLowerCase()) {
            case 'login':
                navigate('/app');
                return;

            case 'logout':
                navigate('/');
                return;

            default:
                navigate('/');
                return;
        }
    }, [auth0Action]);

    // TODO: Use loading component.
    return <p>Loading...</p>;
};

export default Auth0Callback;
