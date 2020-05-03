import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useCombobox } from 'downshift';
import { Box, Flex, Label, Input, Button } from 'theme-ui';
import { useSelector } from 'react-redux';

import { addScheduledRecipe } from '../../../redux/scheduledRecipesSlice';
import { selectRecipes } from '../../../redux/recipesSlice';
import { NOT_FETCHED } from '../../../../util/constants';

const DayPlannerAddRecipe = ({ dateString }) => {
    const dispatch = useDispatch();

    const recipes = useSelector(selectRecipes);

    const [items, setItems] = useState([]);

    useEffect(() => {
        if (recipes !== NOT_FETCHED) {
            setItems(recipes);
        }
    }, [recipes]);

    const itemToString = (item) => (item === null ? '' : item.name);

    const {
        getLabelProps,
        getComboboxProps,
        getInputProps,
        getToggleButtonProps,
        getMenuProps,
        getItemProps,
        isOpen,
        highlightedIndex,
        selectedItem,
        reset
    } = useCombobox({
        items,
        itemToString,
        onInputValueChange: ({ inputValue }) => {
            const searchString = inputValue.toLowerCase();
            setItems(
                recipes.filter((recipe) =>
                    itemToString(recipe)
                        .toLowerCase()
                        .includes(searchString)
                )
            );
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(
            addScheduledRecipe({
                recipeId: selectedItem.id,
                date: dateString
            })
        );

        reset();
    };

    return (
        <Box as="form" onSubmit={handleSubmit}>
            <Label {...getLabelProps()}>Add Recipe:</Label>
            <Box {...getComboboxProps()}>
                <Flex>
                    <Input {...getInputProps({ sx: { width: ['100%', '75%', '50%'] } })} />
                    {/* Add sr-only text or aria-label?*/}
                    <Button {...getToggleButtonProps({ type: 'button' })}>&#8595;</Button>
                </Flex>
            </Box>
            <ul {...getMenuProps()}>
                {isOpen &&
                    items.map((item, index) => (
                        <li
                            style={highlightedIndex === index ? { backgroundColor: '#bde4ff' } : {}}
                            key={item.id}
                            {...getItemProps({ item, index })}
                        >
                            {item.name}
                        </li>
                    ))}
            </ul>
            <Button type="submit" disabled={selectedItem === null}>
                Add
            </Button>
        </Box>
    );
};

export default DayPlannerAddRecipe;
