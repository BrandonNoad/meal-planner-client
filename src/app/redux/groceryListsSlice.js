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
        },
        deleteGroceryList: (state) => state,
        deleteGroceryListFulfilled: (state, action) => {
            const {
                [action.payload.date]: deleteThisGroceryList,
                ...indexedByWeek
            } = state.indexedByWeek;

            return { indexedByWeek };
        },
        updateGroceryList: (state) => state,
        updateGroceryListFulfilled: (state, action) => {
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
    createGroceryListFulfilled,
    deleteGroceryList,
    deleteGroceryListFulfilled,
    updateGroceryList,
    updateGroceryListFulfilled
} = actions;

const groceryListsQuery = `
  query fetchGroceryLists($teamId: Int!, $options: QueryOptionsInput) {
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

const deleteGroceryListMutation = `
  mutation deleteGroceryListMutation($id: Int!) {
    deleteGroceryList(id: $id)
  }
`;

const deleteGroceryListEpic = (action$, state$) => {
    return action$.pipe(
        ofType(deleteGroceryList.type),
        exhaustMap((action) =>
            from(
                UrqlClient.mutation(
                    deleteGroceryListMutation,
                    { id: action.payload.id },
                    { fetchOptions: getFetchOptions(selectAuthToken(state$.value)) }
                ).toPromise()
            ).pipe(map(() => action.payload))
        ),
        map((payload) => deleteGroceryListFulfilled(payload))
    );
};

const updateGroceryListMutation = `
  mutation updateGroceryListMutation($id: Int!, $items: [GroceryListItemInput!]!) {
    updateGroceryList(id: $id, items: $items) {
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

const updateGroceryListEpic = (action$, state$) => {
    return action$.pipe(
        ofType(updateGroceryList.type),
        exhaustMap((action) =>
            from(
                UrqlClient.mutation(
                    updateGroceryListMutation,
                    { id: action.payload.id, items: action.payload.items },
                    { fetchOptions: getFetchOptions(selectAuthToken(state$.value)) }
                ).toPromise()
            ).pipe(map((response) => response.data.updateGroceryList))
        ),
        map((payload) => updateGroceryListFulfilled(payload))
    );
};

export const groceryListsEpic = combineEpics(
    fetchGroceryListsEpic,
    createGroceryListEpic,
    deleteGroceryListEpic,
    updateGroceryListEpic
);

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
