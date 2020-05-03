import { createSlice } from '@reduxjs/toolkit';
import { from } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';

import UrqlClient, { getFetchOptions } from '../util/urqlClient';
import { selectTeam, selectAuthToken } from './userSlice';
import { NOT_FETCHED } from '../../util/constants';

const { reducer, actions } = createSlice({
    name: 'recipes',
    initialState: NOT_FETCHED,
    reducers: {
        fetchRecipes: (state) => state,
        fetchRecipesFulfilled: (state, action) => action.payload
    }
});

export const recipesReducer = reducer;

export const { fetchRecipes, fetchRecipesFulfilled } = actions;

const recipesQuery = `
  query fetchRecipes($teamId: Int!) {
    recipes(teamId: $teamId) {
      id
      name
    }
  }
`;

const fetchRecipesEpic = (action$, state$) => {
    return action$.pipe(
        ofType(fetchRecipes.type),
        exhaustMap(() =>
            from(
                UrqlClient.query(
                    recipesQuery,
                    { teamId: selectTeam(state$.value).id },
                    { fetchOptions: getFetchOptions(selectAuthToken(state$.value)) }
                ).toPromise()
            ).pipe(map((response) => response.data.recipes))
        ),
        map((payload) => fetchRecipesFulfilled(payload))
    );
};

export const recipesEpic = combineEpics(fetchRecipesEpic);

export const selectRecipes = (state) => state.recipes;
