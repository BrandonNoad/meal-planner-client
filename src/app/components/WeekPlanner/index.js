import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Moment from 'moment';
import { Redirect } from '@reach/router';
import { Box, Flex } from 'theme-ui';

import WeekPlannerNav from './WeekPlannerNav';
import WeekPlannerHeading from './WeekPlannerHeading';
import WeekPlannerGroceryListActions from './WeekPlannerGroceryListActions';
import WeekPlannerDayPlans from './WeekPlannerDayPlans';
import { fetchGroceryLists } from '../../redux/groceryListsSlice';

const WeekPlanner = ({ dateString }) => {
    const dispatch = useDispatch();

    const moment = Moment(dateString, 'GGGG-[W]W', true);

    useEffect(() => {
        if (!moment.isValid()) {
            return;
        }

        // Fetch the grocery lists for this week, last week, and next week.
        const dateStrings = [
            Moment(moment)
                .subtract(1, 'week')
                .format('GGGG-[W]W'),
            dateString,
            Moment(moment)
                .add(1, 'week')
                .format('GGGG-[W]W')
        ];

        dispatch(fetchGroceryLists({ dateStrings }));
    }, [moment]);

    if (!moment.isValid()) {
        return <Redirect to="/app" noThrow />;
    }

    return (
        <>
            <Flex mb={3} sx={{ alignItems: 'center' }}>
                <Box mr={3}>
                    <WeekPlannerNav moment={moment} />
                </Box>
                <Box>
                    <WeekPlannerHeading moment={moment} />
                </Box>
                <Box>
                    <WeekPlannerGroceryListActions dateString={dateString} />
                </Box>
            </Flex>
            <Box>
                <WeekPlannerDayPlans moment={moment} />
            </Box>
        </>
    );
};

export default WeekPlanner;
