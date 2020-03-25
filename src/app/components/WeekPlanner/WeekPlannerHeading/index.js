import React from 'react';
import Moment from 'moment';
import { Heading } from 'theme-ui';

// Returns a string in 3 different formats depending on whether Monday and Sunday are in the same
// month/year:
// 1. July 2020
// 2. Jul – Aug 2020
// 3. Dec 2019 – Jan 2020
const getWeekHeading = (moment) => {
    // Monday
    const mondayMoment = Moment(moment).isoWeekday(1);
    const mondayMonth = mondayMoment.month();
    const mondayYear = mondayMoment.year();

    // Sunday
    const sundayMoment = Moment(moment).isoWeekday(7);
    const sundayMonth = sundayMoment.month();
    const sundayYear = sundayMoment.year();

    if (mondayMonth === sundayMonth) {
        return mondayMoment.format('MMMM') + ' ' + mondayMoment.format('YYYY');
    }

    if (mondayYear === sundayYear) {
        return (
            mondayMoment.format('MMM') +
            ' – ' +
            sundayMoment.format('MMM') +
            ' ' +
            mondayMoment.format('YYYY')
        );
    }

    return (
        mondayMoment.format('MMM') +
        ' ' +
        mondayMoment.format('YYYY') +
        ' – ' +
        sundayMoment.format('MMM') +
        ' ' +
        sundayMoment.format('YYYY')
    );
};

const WeekPlannerHeading = ({ moment }) => <Heading>{getWeekHeading(moment)}</Heading>;

export default WeekPlannerHeading;
