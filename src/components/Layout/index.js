import React from 'react';
import { Box, Flex, Button, useColorMode } from 'theme-ui';

import { useUser } from '../../util/customHooks';
import { logIn, logOut } from '../../util/Auth0';
import { NOT_FETCHED } from '../../util/constants';
import Link from '../Link';

const colorModes = ['default', 'dark', 'deep', 'swiss'];

const colorModeToLabel = {
    default: 'Light',
    dark: 'Dark',
    deep: 'Deep',
    swiss: 'Swiss'
};

const AuthButton = ({ user, ...rest }) => {
    if (user === NOT_FETCHED) {
        return null;
    }

    if (user === null) {
        return (
            <Button {...rest} onClick={() => logIn()}>
                Log In
            </Button>
        );
    }

    return (
        <Button {...rest} onClick={() => logOut()}>
            Log Out
        </Button>
    );
};

const Layout = ({ children }) => {
    const [activeColorMode, setActiveColorMode] = useColorMode();

    const user = useUser();

    const handleClickToggleColorMode = () => {
        const index = colorModes.indexOf(activeColorMode);

        const nextColorMode = colorModes[(index + 1) % colorModes.length];

        setActiveColorMode(nextColorMode);
    };

    return (
        <Box>
            <Box as="header">
                <Flex
                    p={3}
                    bg="muted"
                    sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                >
                    <Box>
                        <Link to="/" sx={{ mr: 2 }}>
                            Home
                        </Link>
                        <Link to="/app">App</Link>
                    </Box>
                    <Box>
                        <AuthButton mr={2} user={user} />
                        <Button onClick={handleClickToggleColorMode}>
                            {colorModeToLabel[activeColorMode]}
                        </Button>
                    </Box>
                </Flex>
            </Box>
            <Box as="main" p={4}>
                {children}
            </Box>
            <Box as="footer"></Box>
        </Box>
    );
};

export default Layout;
