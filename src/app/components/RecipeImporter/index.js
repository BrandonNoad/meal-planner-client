import React, { useState, useRef, useEffect } from 'react';
import { Subject, from } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import { Box, Flex, Input, Button } from 'theme-ui';

import UrqlClient, { getFetchOptions } from '../../util/urqlClient';
import { selectTeam, selectAuthToken } from '../../redux/userSlice';

const importRecipeMutation = `
    mutation importRecipeMutation($teamId: Int!, $url: String!) {
        importRecipe(teamId: $teamId, url: $url) {
            state
        }
    }
`;

const useAsyncOperation = (getPromise, observer) => {
    const subjectRef = useRef(new Subject());

    useEffect(() => {
        const subscription = subjectRef.current
            .pipe(exhaustMap((args) => from(getPromise(args))))
            .subscribe(observer);

        return () => subscription.unsubscribe();
    }, []);

    return subjectRef.current.next.bind(subjectRef.current);
};

const RecipeImporter = ({ user }) => {
    const [url, setUrl] = useState('');

    const next = useAsyncOperation(
        ({ user, url }) => {
            const team = selectTeam({ user });
            const authToken = selectAuthToken({ user });

            return UrqlClient.mutation(
                importRecipeMutation,
                { teamId: team.id, url },
                { fetchOptions: getFetchOptions(authToken) }
            ).toPromise();
        },
        {
            next: () => {
                setUrl('');
            }
        }
    );

    const handleChangeRecipeUrl = (e) => {
        setUrl(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (url.trim() === '') {
            return;
        }

        next({ user, url });
    };

    return (
        <>
            <Box as="form" onSubmit={handleSubmit}>
                <Flex>
                    <Input
                        placeholder="Recipe url"
                        value={url}
                        onChange={handleChangeRecipeUrl}
                        mr={2}
                        sx={{ width: ['100%', '75%', '50%'] }}
                    />
                    <Button type="submit">Import!</Button>
                </Flex>
            </Box>
        </>
    );
};

export default RecipeImporter;
