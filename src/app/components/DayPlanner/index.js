import React, { useEffect } from 'react';
import Moment from 'moment';
import { Redirect } from '@reach/router';
import { useDispatch } from 'react-redux';

import DayPlannerHeading from './DayPlannerHeading';
import DayPlannerAddRecipe from './DayPlannerAddRecipe';
import DayPlannerRecipes from './DayPlannerRecipes';
import { fetchScheduledRecipes } from '../../redux/scheduledRecipesSlice';
import { fetchRecipes } from '../../redux/recipesSlice';

const DayPlanner = ({ dateString }) => {
    const dispatch = useDispatch();

    // TODO: move to <DayPlannerAddRecipe />?
    useEffect(() => {
        // Fetch the recipes for the Add Recipe dropdown.
        dispatch(fetchRecipes());
    }, []);

    const moment = Moment(dateString, 'YYYY-MM-DD', true);

    // TODO: move to <DayPlannerRecipes />?
    useEffect(() => {
        if (!moment.isValid()) {
            return;
        }

        // Fetch the recipes for this day.
        dispatch(fetchScheduledRecipes({ dateStrings: [dateString] }));
    }, [moment]);

    if (!moment.isValid()) {
        return <Redirect to="/app" noThrow />;
    }

    return (
        <>
            <DayPlannerHeading moment={moment} />
            <DayPlannerAddRecipe dateString={dateString} />
            <DayPlannerRecipes dateString={dateString} />
        </>
    );
};

export default DayPlanner;
