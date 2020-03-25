import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { selectRecipesFactory } from '../../../../../redux/scheduledRecipesSlice';
import { NOT_FETCHED } from '../../../../../../util/constants';

const WeekPlannerDayPlanRecipes = ({ moment }) => {
    const selectRecipes = useMemo(selectRecipesFactory, []);

    const recipes = useSelector((state) => selectRecipes(state, moment.format('YYYY-MM-DD')));

    if (recipes === NOT_FETCHED) {
        return <p>Loading...</p>;
    }

    if (recipes.length === 0) {
        return 'No Recipes!';
    }

    const NUM_RECIPES_TO_DISPLAY = 3;

    const items = recipes
        .slice(0, NUM_RECIPES_TO_DISPLAY)
        .map((recipe, idx) => <li key={idx}>{recipe.name}</li>);

    return recipes.length <= NUM_RECIPES_TO_DISPLAY ? (
        <ul>{items}</ul>
    ) : (
        <ul>{[...items, `+ ${recipes.length - NUM_RECIPES_TO_DISPLAY} More!`]}</ul>
    );
};

export default WeekPlannerDayPlanRecipes;
