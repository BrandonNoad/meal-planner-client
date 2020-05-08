import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from '@reach/router';
import _has from 'lodash/has';
import _groupBy from 'lodash/groupBy';
import _map from 'lodash/map';
import { Box, Heading, Button } from 'theme-ui';

import GroceryListItemForm from './GroceryListItemForm';
import {
    selectGroceryListForWeekFactory,
    deleteGroceryList,
    updateGroceryList
} from '../../redux/groceryListsSlice';

const GroceryListItem = ({ item, onSubmit, onClickDelete }) => {
    const [isRead, setIsRead] = useState(true);

    const content = isRead ? (
        <>
            {item.name} {item.quantity} {item.unit}
            <Button onClick={onClickDelete}>X</Button>
            <Button
                onClick={() => {
                    setIsRead(false);
                }}
            >
                Edit
            </Button>
        </>
    ) : (
        <GroceryListItemForm
            category={item.category}
            item={item.name}
            quantity={item.quantity}
            unit={item.unit}
            onSubmit={onSubmit}
            onCancel={() => {
                setIsRead(true);
            }}
        />
    );

    return <li>{content}</li>;
};

const GroceryList = ({ dateString }) => {
    const dispatch = useDispatch();

    const selectGroceryListForWeek = useMemo(selectGroceryListForWeekFactory, []);

    const groceryList = useSelector((state) => selectGroceryListForWeek(state, dateString));

    if (!_has(groceryList, 'id')) {
        return <Redirect to="/app" noThrow />;
    }

    const handleClickDeleteGroceryList = () => {
        dispatch(deleteGroceryList(groceryList));
    };

    const itemToPayload = ({ name, category, quantity, unit }) => ({
        name,
        category,
        quantity,
        unit
    });

    const addItem = (newItem) => {
        dispatch(
            updateGroceryList({
                id: groceryList.id,
                items: [...groceryList.items.map(itemToPayload), newItem]
            })
        );
    };

    const updateItem = (updatedItem, idx) => {
        dispatch(
            updateGroceryList({
                id: groceryList.id,
                items: [
                    ...groceryList.items.slice(0, idx).map(itemToPayload),
                    updatedItem,
                    ...groceryList.items.slice(idx + 1).map(itemToPayload)
                ]
            })
        );
    };

    const deleteItem = (itemToDelete) => {
        dispatch(
            updateGroceryList({
                id: groceryList.id,
                items: groceryList.items.filter((item) => item !== itemToDelete).map(itemToPayload)
            })
        );
    };

    const itemsGrouped = _groupBy(groceryList.items, 'category');

    return (
        <Box>
            <Heading>{groceryList.name}</Heading>
            <Button onClick={handleClickDeleteGroceryList}>Delete Grocery List</Button>
            <br />
            {'TODO: Sort Categories alphabetically'}
            <br />
            {'TODO: Sort Items within a Category alphabetically'}
            {_map(itemsGrouped, (items, category) => {
                return (
                    <Box key={category}>
                        <Heading as="h4">{category}</Heading>
                        <ul>
                            {items.map((item, idx) => (
                                <GroceryListItem
                                    key={item.name + item.unit}
                                    item={item}
                                    onSubmit={(updatedItem) => updateItem(updatedItem, idx)}
                                    onClickDelete={() => deleteItem(item)}
                                />
                            ))}
                        </ul>
                    </Box>
                );
            })}
            <GroceryListItemForm onSubmit={addItem} onCancel={() => {}} />
        </Box>
    );
};

export default GroceryList;
