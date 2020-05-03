import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { selectRecipesForDayFactory } from '../../../../../redux/scheduledRecipesSlice';
import { NOT_FETCHED } from '../../../../../../util/constants';

const WeekPlannerDayPlanRecipes = ({ moment }) => {
    const selectRecipesForDay = useMemo(selectRecipesForDayFactory, []);

    const recipes = useSelector((state) => selectRecipesForDay(state, moment.format('YYYY-MM-DD')));

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

    const extraItem = (
        <li key={NUM_RECIPES_TO_DISPLAY}>{`+ ${recipes.length - NUM_RECIPES_TO_DISPLAY} More!`}</li>
    );

    return (
        <ul className="fa-ul" style={{ lineHeight: 'normal' }}>
            {recipes.length <= NUM_RECIPES_TO_DISPLAY ? items : [...items, extraItem]}
        </ul>
    );
};

export default WeekPlannerDayPlanRecipes;
