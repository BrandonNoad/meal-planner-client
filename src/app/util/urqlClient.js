import { createClient } from 'urql';

const client = createClient({ url: `${process.env.GATSBY_MEAL_PLANNER_API_BASE_URL}/graphql` });

export default client;

export const getFetchOptions = (authToken) => ({
    headers: { authorization: `Bearer ${authToken}` }
});
