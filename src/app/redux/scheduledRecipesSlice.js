import { createSlice, createSelector } from '@reduxjs/toolkit';
import { from, of } from 'rxjs';
import { switchMap, map, exhaustMap } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';
import _keyBy from 'lodash/keyBy';
import _groupBy from 'lodash/groupBy';

import UrqlClient, { getFetchOptions } from '../util/urqlClient';
import { selectTeam, selectAuthToken } from './userSlice';
import { NOT_FETCHED } from '../../util/constants';

const { reducer, actions } = createSlice({
    name: 'scheduledRecipes',
    initialState: {
        groupedByDate: {},
        indexedById: {}
    },
    reducers: {
        fetchScheduledRecipes: (state) => state,
        fetchScheduledRecipesFulfilled: (state, action) => {
            const { scheduledRecipes, dateStrings } = action.payload;

            const indexedById = {
                ...state.indexedById,
                ..._keyBy(scheduledRecipes, 'id')
            };

            const scheduledRecipesGroupedByDate = _groupBy(scheduledRecipes, 'date');

            const groupedByDate = {
                ...state.groupedByDate,
                ...dateStrings.reduce((acc, dateString) => {
                    const scheduledRecipesForDate = scheduledRecipesGroupedByDate[dateString] || [];

                    acc[dateString] = scheduledRecipesForDate.map(({ id }) => id);

                    return acc;
                }, {})
            };

            return { indexedById, groupedByDate };
        },
        addScheduledRecipe: (state) => state,
        addScheduledRecipeFulfilled: (state, action) => {
            const indexedById = {
                ...state.indexedById,
                [action.payload.id]: action.payload
            };

            const scheduledRecipeIdsForDate = state.groupedByDate[action.payload.date] || [];

            const groupedByDate = {
                ...state.groupedByDate,
                [action.payload.date]: [...scheduledRecipeIdsForDate, action.payload.id]
            };

            return { indexedById, groupedByDate };
        },
        removeScheduledRecipe: (state) => state,
        removeScheduledRecipeFulfilled: (state, action) => {
            const { [action.payload.id]: removeThisRecipe, ...indexedById } = state.indexedById;

            const groupedByDate = {
                ...state.groupedByDate,
                [removeThisRecipe.date]: state.groupedByDate[removeThisRecipe.date].filter(
                    (id) => id !== removeThisRecipe.id
                )
            };

            return { indexedById, groupedByDate };
        }
    }
});

export const scheduledRecipesReducer = reducer;

export const {
    fetchScheduledRecipes,
    fetchScheduledRecipesFulfilled,
    addScheduledRecipe,
    addScheduledRecipeFulfilled,
    removeScheduledRecipe,
    removeScheduledRecipeFulfilled
} = actions;

const scheduledRecipesQuery = `
  query fetchScheduledRecipes($teamId: Int!, $options: QueryOptionsInput) {
    scheduledRecipes(teamId: $teamId, options: $options) {
      id
      date
      recipe {
          id
          name
          url
      }
    }
  }
`;

const fetchScheduledRecipesEpic = (action$, state$) => {
    const selectRecipesForDay = selectRecipesForDayFactory();

    return action$.pipe(
        ofType(fetchScheduledRecipes.type),
        switchMap((action) => {
            const dateStrings = action.payload.dateStrings.filter((dateString) => {
                const recipes = selectRecipesForDay(state$.value, dateString);

                return recipes === NOT_FETCHED;
            });

            if (dateStrings.length === 0) {
                return of({ dateStrings, scheduledRecipes: [] });
            }

            return from(
                UrqlClient.query(
                    scheduledRecipesQuery,
                    {
                        teamId: selectTeam(state$.value).id,
                        options: { filter: { date: dateStrings } }
                    },
                    { fetchOptions: getFetchOptions(selectAuthToken(state$.value)) }
                ).toPromise()
            ).pipe(
                map((response) => ({
                    dateStrings: dateStrings,
                    scheduledRecipes: response.data.scheduledRecipes
                }))
            );
        }),
        map((payload) => fetchScheduledRecipesFulfilled(payload))
    );
};

const addRecipeMutation = `
  mutation addRecipeMutation($recipeId: Int!, $date: String!) {
    addRecipe(recipeId: $recipeId, date: $date) {
      id
      date
      recipe {
          name
          url
      }
    }
  }
`;

const addScheduledRecipeEpic = (action$, state$) =>
    action$.pipe(
        ofType(addScheduledRecipe.type),
        exhaustMap((action) =>
            from(
                UrqlClient.mutation(
                    addRecipeMutation,
                    { recipeId: action.payload.recipeId, date: action.payload.date },
                    { fetchOptions: getFetchOptions(selectAuthToken(state$.value)) }
                ).toPromise()
            ).pipe(map((response) => response.data.addRecipe))
        ),
        map((payload) => addScheduledRecipeFulfilled(payload))
    );

const removeRecipeMutation = `
  mutation removeRecipeMutation($id: Int!) {
    removeRecipe(id: $id)
  }
`;

const removeScheduledRecipeEpic = (action$, state$) =>
    action$.pipe(
        ofType(removeScheduledRecipe.type),
        exhaustMap((action) =>
            from(
                UrqlClient.mutation(
                    removeRecipeMutation,
                    { id: action.payload.id },
                    { fetchOptions: getFetchOptions(selectAuthToken(state$.value)) }
                ).toPromise()
            ).pipe(map(() => action.payload))
        ),
        map((payload) => removeScheduledRecipeFulfilled(payload))
    );

export const scheduledRecipesEpic = combineEpics(
    fetchScheduledRecipesEpic,
    addScheduledRecipeEpic,
    removeScheduledRecipeEpic
);

const selectScheduledRecipes = (state) => state.scheduledRecipes;

export const selectRecipesForDayFactory = () =>
    createSelector(
        selectScheduledRecipes,
        (state, dateString) => dateString,
        (scheduledRecipes, dateString) => {
            if (scheduledRecipes.groupedByDate[dateString] === undefined) {
                return NOT_FETCHED;
            }

            return scheduledRecipes.groupedByDate[dateString].map((id) => ({
                ...scheduledRecipes.indexedById[id].recipe,
                id
            }));
        }
    );
