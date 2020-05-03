import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
    selectRecipesForDayFactory,
    removeScheduledRecipe
} from '../../../redux/scheduledRecipesSlice';
import { NOT_FETCHED } from '../../../../util/constants';

const DayPlannerRecipes = ({ dateString }) => {
    const dispatch = useDispatch();

    // useMemo vs useCallback
    // The difference is that useCallback returns its function when the dependencies change while
    // useMemo calls its function and returns the result.
    // We want each component to have its own copy of selectRecipes, so use useMemo.
    const selectRecipesForDay = useMemo(selectRecipesForDayFactory, []);

    const recipes = useSelector((state) => selectRecipesForDay(state, dateString));

    if (recipes === NOT_FETCHED) {
        return <p>Loading...</p>;
    }

    if (recipes.length === 0) {
        return 'No Recipes!';
    }

    const removeRecipe = (id) => {
        dispatch(removeScheduledRecipe({ id }));
    };

    const items = recipes.map((recipe) => (
        <li key={recipe.id}>
            {recipe.name}&nbsp;
            <button onClick={() => removeRecipe(recipe.id)}>X</button>
        </li>
    ));

    return <ul>{items}</ul>;
};

export default DayPlannerRecipes;
