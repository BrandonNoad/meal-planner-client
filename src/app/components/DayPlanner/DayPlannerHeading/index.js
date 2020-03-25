import React from 'react';
import { Heading } from 'theme-ui';

const DayPlannerHeading = ({ moment }) => <Heading>{moment.format('dddd, MMMM Do YYYY')}</Heading>;

export default DayPlannerHeading;
