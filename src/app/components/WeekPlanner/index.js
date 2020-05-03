import React, { useReducer } from 'react';
import { useDispatch } from 'react-redux';
import Moment from 'moment';
import { Redirect } from '@reach/router';
import { Box, Flex } from 'theme-ui';

import WeekPlannerNav from './WeekPlannerNav';
import WeekPlannerHeading from './WeekPlannerHeading';
import WeekPlannerDayPlans from './WeekPlannerDayPlans';
import { createGroceryList } from '../../redux/groceryListsSlice';

const WeekPlanner = ({ dateString }) => {
    const dispatch = useDispatch();

    const moment = Moment(dateString, 'GGGG-[W]W', true);

    if (!moment.isValid()) {
        return <Redirect to="/app" noThrow />;
    }

    const handleClickCreateGroceryList = () => {
        dispatch(createGroceryList({ date: dateString }));
    };

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
                    <button onClick={handleClickCreateGroceryList}>+</button>
                </Box>
            </Flex>
            <Box>
                <WeekPlannerDayPlans moment={moment} />
            </Box>
        </>
    );
};

export default WeekPlanner;
