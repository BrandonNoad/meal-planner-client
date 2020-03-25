import React from 'react';
import { Heading } from 'theme-ui';

import Link from '../../../../../../components/Link';

const WeekPlannerDayPlanHeading = ({ moment }) => (
    <Heading as="h3">
        <Link to={`/app/plan/day/${moment.format('YYYY-MM-DD')}`}>
            {moment.format('ddd D').toUpperCase()}
        </Link>
    </Heading>
);

export default WeekPlannerDayPlanHeading;
