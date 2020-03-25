import React from 'react';
import { Card } from 'theme-ui';

import WeekPlannerDayPlanHeading from './WeekPlannerDayPlanHeading';
import WeekPlannerDayPlanRecipes from './WeekPlannerDayPlanRecipes';

const WeekPlannerDayPlan = ({ moment }) => (
    <Card>
        <WeekPlannerDayPlanHeading moment={moment} />
        <WeekPlannerDayPlanRecipes moment={moment} />
    </Card>
);

export default WeekPlannerDayPlan;
