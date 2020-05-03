import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from '@reach/router';
import _has from 'lodash/has';
import { Box, Heading } from 'theme-ui';

import { selectGroceryListForWeekFactory } from '../../redux/groceryListsSlice';

const GroceryList = ({ dateString }) => {
    const selectGroceryListForWeek = useMemo(selectGroceryListForWeekFactory, []);

    const groceryList = useSelector((state) => selectGroceryListForWeek(state, dateString));

    if (!_has(groceryList, 'id')) {
        return <Redirect to="/app" noThrow />;
    }

    return (
        <Box>
            <Heading>{groceryList.name}</Heading>
            <ul>
                {groceryList.items.map((item, idx) => (
                    <li key={idx}>
                        {item.name} {item.quantity} {item.unit}
                    </li>
                ))}
            </ul>
        </Box>
    );
};

export default GroceryList;
