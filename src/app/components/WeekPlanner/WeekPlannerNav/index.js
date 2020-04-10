import React from 'react';
import Moment from 'moment';
import { Button, Text } from 'theme-ui';

import Link from '../../../../components/Link';

const momentToDateString = (moment) => moment.format('GGGG-[W]W');

const WeekPlannerNav = ({ moment }) => {
    const prevWeekDateString = momentToDateString(Moment(moment).subtract(7, 'days'));

    const todayDateString = momentToDateString(Moment());

    const nextWeekDateString = momentToDateString(Moment(moment).add(7, 'days'));

    const sx = {
        boxShadow: 'none',
        color: 'text',
        borderRadius: 'full',
        backgroundColor: 'transparent',
        '&:hover': {
            backgroundColor: 'greyPalette.0'
        }
    };

    const sxToday = {
        boxShadow: 'none',
        color: 'text',
        borderColor: 'greyPalette.1',
        '&:hover': {
            backgroundColor: 'greyPalette.0',
            borderColor: 'transparent',
            color: 'text'
        }
    };

    return (
        <>
            <Button as={Link} sx={sx} to={`/app/plan/week/${prevWeekDateString}`}>
                {'<'}
            </Button>
            <Button
                variant="outline"
                sx={sxToday}
                mx={2}
                as={Link}
                to={`/app/plan/week/${todayDateString}`}
            >
                <Text variant="uppercase">Today</Text>
            </Button>
            <Button as={Link} sx={sx} to={`/app/plan/week/${nextWeekDateString}`}>
                {'>'}
            </Button>
        </>
    );
};

export default WeekPlannerNav;
