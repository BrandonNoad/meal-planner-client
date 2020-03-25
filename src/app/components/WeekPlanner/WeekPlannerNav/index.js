import React from 'react';
import Moment from 'moment';
import { Button } from 'theme-ui';
import Link from '../../../../components/Link';

const momentToDateString = (moment) => moment.format('GGGG-[W]W');

const WeekPlannerNav = ({ moment }) => {
    const prevWeekDateString = momentToDateString(Moment(moment).subtract(7, 'days'));

    const todayDateString = momentToDateString(Moment());

    const nextWeekDateString = momentToDateString(Moment(moment).add(7, 'days'));

    return (
        <>
            <Button as={Link} to={`/app/plan/week/${prevWeekDateString}`}>
                {'<'}
            </Button>
            <Button mx={2} as={Link} to={`/app/plan/week/${todayDateString}`}>
                {'TODAY'}
            </Button>
            <Button as={Link} to={`/app/plan/week/${nextWeekDateString}`}>
                {'>'}
            </Button>
        </>
    );
};

export default WeekPlannerNav;
