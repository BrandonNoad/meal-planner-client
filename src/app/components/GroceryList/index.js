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
    const [isEditMode, setIsEditMode] = useState(false);

    const content = isEditMode ? (
        <GroceryListItemForm
            category={item.category}
            item={item.name}
            quantity={item.quantity}
            unit={item.unit}
            onSubmit={onSubmit}
            onCancel={() => {
                setIsEditMode(false);
            }}
        />
    ) : (
        <>
            {item.name} {item.quantity} {item.unit}
            <Button onClick={onClickDelete}>X</Button>
            <Button
                onClick={() => {
                    setIsEditMode(true);
                }}
            >
                Edit
            </Button>
        </>
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

    const items = groceryList.items.map(({ __typename, ...rest }) => rest);

    const handleClickDeleteGroceryList = () => {
        dispatch(deleteGroceryList(groceryList));
    };

    // TODO: Get rid of me
    const itemToPayload = ({ category, item, quantity, unit }) => ({
        name: item,
        category,
        quantity,
        unit
    });

    const addItem = (newItem) => {
        dispatch(
            updateGroceryList({
                id: groceryList.id,
                items: [...items, newItem]
            })
        );
    };

    const updateItem = (oldItem, updatedItem) => {
        const idx = items.indexOf(oldItem);

        if (idx < 0) {
            throw new Error('Bad implementation');
        }

        dispatch(
            updateGroceryList({
                id: groceryList.id,
                items: [...items.slice(0, idx), updatedItem, ...items.slice(idx + 1)]
            })
        );
    };

    const deleteItem = (itemToDelete) => {
        dispatch(
            updateGroceryList({
                id: groceryList.id,
                items: items.filter((item) => item !== itemToDelete)
            })
        );
    };

    const itemsGrouped = _groupBy(items, 'category');

    return (
        <Box>
            <Heading>{groceryList.name}</Heading>
            <Button onClick={handleClickDeleteGroceryList}>Delete Grocery List</Button>
            <br />
            {'TODO: Sort Categories alphabetically'}
            <br />
            {'TODO: Sort Items within a Category alphabetically'}
            <br />
            {'TODO: When a new item is added, try to group it before saving'}
            {_map(itemsGrouped, (items, category) => {
                return (
                    <Box key={category}>
                        <Heading as="h4">{category}</Heading>
                        <ul>
                            {items.map((item) => (
                                <GroceryListItem
                                    key={item.name + item.unit}
                                    item={item}
                                    onSubmit={(updatedItem) =>
                                        updateItem(item, itemToPayload(updatedItem))
                                    }
                                    onClickDelete={() => deleteItem(item)}
                                />
                            ))}
                        </ul>
                    </Box>
                );
            })}
            <GroceryListItemForm
                onSubmit={(newItem) => addItem(itemToPayload(newItem))}
                onCancel={() => {}}
            />
        </Box>
    );
};

export default GroceryList;
