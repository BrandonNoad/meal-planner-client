import React, { useState } from 'react';
import { useCombobox } from 'downshift';
import { Box, Flex, Label, Input, Button } from 'theme-ui';

const initialItems = ['red', 'red2', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

const DayPlannerAddRecipe = () => {
    const [items, setItems] = useState(initialItems);

    const {
        getLabelProps,
        getComboboxProps,
        getInputProps,
        getToggleButtonProps,
        getMenuProps,
        getItemProps,
        isOpen,
        highlightedIndex
        // selectedItem
    } = useCombobox({
        items,
        onInputValueChange: ({ inputValue }) => {
            const searchString = inputValue.toLowerCase();
            setItems(initialItems.filter((item) => item.toLowerCase().startsWith(searchString)));
        }
    });

    return (
        <Box as="form">
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
                            key={`${item}${index}`}
                            {...getItemProps({ item, index })}
                        >
                            {item}
                        </li>
                    ))}
            </ul>
        </Box>
    );
};

export default DayPlannerAddRecipe;
