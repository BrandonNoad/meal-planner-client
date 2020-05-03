import { createSlice, createSelector } from '@reduxjs/toolkit';
import { from, of } from 'rxjs';
import { switchMap, exhaustMap, map } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';
import _keyBy from 'lodash/keyBy';

import UrqlClient, { getFetchOptions } from '../util/urqlClient';
import { selectTeam, selectAuthToken } from './userSlice';
import { NOT_FETCHED } from '../../util/constants';

const { reducer, actions } = createSlice({
    name: 'groceryLists',
    initialState: {
        indexedByWeek: {}
    },
    reducers: {
        fetchGroceryLists: (state) => state,
        fetchGroceryListsFulfilled: (state, action) => {
            const { groceryLists, dateStrings } = action.payload;

            const groceryListsIndexedByDate = _keyBy(groceryLists, 'date');

            const indexedByWeek = {
                ...state.indexedByWeek,
                ...dateStrings.reduce((acc, dateString) => {
                    acc[dateString] =
                        groceryListsIndexedByDate[dateString] !== undefined
                            ? groceryListsIndexedByDate[dateString]
                            : null;

                    return acc;
                }, {})
            };

            return { indexedByWeek };
        },
        createGroceryList: (state) => state,
        createGroceryListFulfilled: (state, action) => {
            const indexedByWeek = {
                ...state.indexedByWeek,
                [action.payload.date]: action.payload
            };

            return { indexedByWeek };
        }
    }
});

export const groceryListsReducer = reducer;

export const {
    fetchGroceryLists,
    fetchGroceryListsFulfilled,
    createGroceryList,
    createGroceryListFulfilled
} = actions;

const groceryListsQuery = `
  query fetchGroceryLists($teamId: Int!, $options: QueryOptions) {
    groceryLists(teamId: $teamId, options: $options) {
      id
      date
      name
      items {
          name
          category
          quantity
          unit
      }
    }
  }
`;

const fetchGroceryListsEpic = (action$, state$) => {
    const selectGroceryListForWeek = selectGroceryListForWeekFactory();

    return action$.pipe(
        ofType(fetchGroceryLists.type),
        switchMap((action) => {
            const dateStrings = action.payload.dateStrings.filter((dateString) => {
                const groceryList = selectGroceryListForWeek(state$.value, dateString);

                return groceryList === NOT_FETCHED;
            });

            if (dateStrings.length === 0) {
                return of({ dateStrings, groceryLists: [] });
            }

            return from(
                UrqlClient.query(
                    groceryListsQuery,
                    {
                        teamId: selectTeam(state$.value).id,
                        options: { filter: { date: dateStrings } }
                    },
                    { fetchOptions: getFetchOptions(selectAuthToken(state$.value)) }
                ).toPromise()
            ).pipe(
                map((response) => ({
                    dateStrings: dateStrings,
                    groceryLists: response.data.groceryLists
                }))
            );
        }),
        map((payload) => fetchGroceryListsFulfilled(payload))
    );
};

const createGroceryListMutation = `
  mutation createGroceryListMutation($teamId: Int!, $date: String!) {
    createGroceryList(teamId: $teamId, date: $date) {
      id
      date
      name
      items {
          name
          category
          quantity
          unit
      }
    }
  }
`;

const createGroceryListEpic = (action$, state$) => {
    return action$.pipe(
        ofType(createGroceryList.type),
        exhaustMap((action) =>
            from(
                UrqlClient.mutation(
                    createGroceryListMutation,
                    { teamId: selectTeam(state$.value).id, date: action.payload.date },
                    { fetchOptions: getFetchOptions(selectAuthToken(state$.value)) }
                ).toPromise()
            ).pipe(map((response) => response.data.createGroceryList))
        ),
        map((payload) => createGroceryListFulfilled(payload))
    );
};

export const groceryListsEpic = combineEpics(fetchGroceryListsEpic, createGroceryListEpic);

const selectGroceryLists = (state) => state.groceryLists;

export const selectGroceryListForWeekFactory = () =>
    createSelector(
        selectGroceryLists,
        (state, dateString) => dateString,
        (groceryLists, dateString) => {
            if (groceryLists.indexedByWeek[dateString] === undefined) {
                return NOT_FETCHED;
            }

            return groceryLists.indexedByWeek[dateString];
        }
    );
