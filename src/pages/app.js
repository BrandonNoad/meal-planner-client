import React from 'react';
import { Router, Redirect } from '@reach/router';
import Moment from 'moment';

import Layout from '../components/Layout';
import Auth0Callback from '../app/components/Auth0Callback';
import PrivateRoute from '../app/components/PrivateRoute';
import WeekPlanner from '../app/components/WeekPlanner';
import DayPlanner from '../app/components/DayPlanner';
import RecipeImporter from '../app/components/RecipeImporter';

const AppPage = () => {
    // e.g. 2020-W25
    const defaultWeekDateString = Moment().format('GGGG-[W]W');

    return (
        <Layout>
            <Router>
                <Auth0Callback path="/app/auth0/:auth0Action" />
                <PrivateRoute path="/app/plan/week/:dateString" component={WeekPlanner} />
                <PrivateRoute path="/app/plan/day/:dateString" component={DayPlanner} />
                <PrivateRoute path="/app/import" component={RecipeImporter} />
                <Redirect from="/app/*" to={`/app/plan/week/${defaultWeekDateString}`} noThrow />
            </Router>
        </Layout>
    );
};

export default AppPage;
