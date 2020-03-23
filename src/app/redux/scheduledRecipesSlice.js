import { createSlice, createSelector } from '@reduxjs/toolkit';
import { from, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
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
                    const scheduledRecipeIds = scheduledRecipesGroupedByDate[dateString] || [];

                    acc[dateString] = scheduledRecipeIds.map(({ id }) => id);

                    return acc;
                }, {})
            };

            return { indexedById, groupedByDate };
        }
    }
});

export const scheduledRecipesReducer = reducer;

export const { fetchScheduledRecipes, fetchScheduledRecipesFulfilled } = actions;

const scheduledRecipesQuery = `
  query fetchScheduledRecipes($teamId: Int!, $options: ScheduledRecipesOptions) {
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
    const selectRecipes = selectRecipesFactory();

    return action$.pipe(
        ofType(fetchScheduledRecipes.type),
        switchMap((action) => {
            const dateStrings = action.payload.dateStrings.filter((dateString) => {
                const recipes = selectRecipes(state$.value, dateString);

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

export const scheduledRecipesEpic = combineEpics(fetchScheduledRecipesEpic);

const selectScheduledRecipes = (state) => state.scheduledRecipes;

export const selectRecipesFactory = () =>
    createSelector(
        selectScheduledRecipes,
        (state, dateString) => dateString,
        (scheduledRecipes, dateString) => {
            if (scheduledRecipes.groupedByDate[dateString] === undefined) {
                return NOT_FETCHED;
            }

            return scheduledRecipes.groupedByDate[dateString].map(
                (id) => scheduledRecipes.indexedById[id].recipe
            );
        }
    );
