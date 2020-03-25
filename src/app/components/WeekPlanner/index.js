import React, { useReducer } from 'react';
import Moment from 'moment';
import { Redirect } from '@reach/router';
import { Box, Flex } from 'theme-ui';

import WeekPlannerNav from './WeekPlannerNav';
import WeekPlannerHeading from './WeekPlannerHeading';
import WeekPlannerDayPlans from './WeekPlannerDayPlans';

const WeekPlanner = ({ dateString }) => {
    const moment = Moment(dateString, 'GGGG-[W]W', true);

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
            </Flex>
            <Box>
                <WeekPlannerDayPlans moment={moment} />
            </Box>
        </>
    );
};

export default WeekPlanner;
