import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Moment from 'moment';
import _range from 'lodash/range';
import { Grid } from 'theme-ui';

import WeekPlannerDayPlan from './WeekPlannerDayPlan';
import { fetchScheduledRecipes } from '../../../redux/scheduledRecipesSlice';

const WeekPlannerDayPlans = ({ moment }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Fetch the recipes for this week, last week, and next week.

        const MONDAY_LAST_WEEK = -6;
        const SUNDAY_NEXT_WEEK = 14;

        dispatch(
            fetchScheduledRecipes({
                dateStrings: _range(MONDAY_LAST_WEEK, SUNDAY_NEXT_WEEK + 1).map((n) =>
                    Moment(moment)
                        .isoWeekday(n)
                        .format('YYYY-MM-DD')
                )
            })
        );
    }, [moment]);

    return (
        <>
            {'TODO: disable Edit Recipes when a Grocery List Exists'}
            <Grid gap={3} columns={[1, 2, 4]}>
                {_range(7).map((n) => {
                    // Sets the ISO day of the week with 1 being Monday and 7 being Sunday.
                    const dayMoment = Moment(moment).isoWeekday(n + 1);

                    return (
                        <WeekPlannerDayPlan
                            moment={dayMoment}
                            key={dayMoment.format('YYYY-MM-DD')}
                        />
                    );
                })}
            </Grid>
        </>
    );
};

export default WeekPlannerDayPlans;
