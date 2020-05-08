import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'theme-ui';

import Link from '../../../../components/Link';
import {
    createGroceryList,
    selectGroceryListForWeekFactory
} from '../../../redux/groceryListsSlice';
import { NOT_FETCHED } from '../../../../util/constants';

const WeekPlannerGroceryListActions = ({ dateString }) => {
    const dispatch = useDispatch();

    const selectGroceryListForWeek = useMemo(selectGroceryListForWeekFactory, []);

    const groceryList = useSelector((state) => selectGroceryListForWeek(state, dateString));

    if (groceryList === NOT_FETCHED) {
        return null;
    }

    if (groceryList === null) {
        const handleClick = () => {
            dispatch(createGroceryList({ date: dateString }));
        };

        return (
            <>
                <Button onClick={handleClick}>Create Grocery List</Button>
                {'TODO: This should redirect you to the list'}
            </>
        );
    }

    return (
        <Button as={Link} to={`/app/groceryLists/${dateString}`}>
            View Grocery List
        </Button>
    );
};

export default WeekPlannerGroceryListActions;
