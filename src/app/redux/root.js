import { combineReducers } from '@reduxjs/toolkit';
import { combineEpics } from 'redux-observable';

import { userReducer, userEpic } from './userSlice';
import { scheduledRecipesReducer, scheduledRecipesEpic } from './scheduledRecipesSlice';
import { recipesReducer, recipesEpic } from './recipesSlice';
import { groceryListsReducer, groceryListsEpic } from './groceryListsSlice';

export const rootReducer = combineReducers({
    user: userReducer,
    scheduledRecipes: scheduledRecipesReducer,
    recipes: recipesReducer,
    groceryLists: groceryListsReducer
});

export const rootEpic = combineEpics(userEpic, scheduledRecipesEpic, recipesEpic, groceryListsEpic);
