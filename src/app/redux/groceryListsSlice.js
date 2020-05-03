import { createSlice, createSelector } from '@reduxjs/toolkit';
import { from } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';

import UrqlClient, { getFetchOptions } from '../util/urqlClient';
import { selectTeam, selectAuthToken } from './userSlice';
import { NOT_FETCHED } from '../../util/constants';

const { reducer, actions } = createSlice({
    name: 'groceryLists',
    initialState: {
        indexedByWeek: {}
    },
    reducers: {
        fetchGroceryList: (state) => state,
        fetchGroceryListFulfilled: (state, action) => ({
            ...state.indexedByWeek,
            [action.payload.date]: action.payload
        }),
        createGroceryList: (state) => state,
        createGroceryListFulfilled: (state, action) => ({
            ...state.indexedByWeek,
            [action.payload.date]: action.payload
        })
    }
});

export const groceryListsReducer = reducer;

export const {
    fetchGroceryList,
    fetchRecipesFulfilled,
    createGroceryList,
    createGroceryListFulfilled
} = actions;

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

export const groceryListsEpic = combineEpics(createGroceryListEpic);

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
