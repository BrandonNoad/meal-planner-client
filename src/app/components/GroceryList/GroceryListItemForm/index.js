import React from 'react';
import { Form, Field } from 'react-final-form';
import { Box, Flex, Input, Button } from 'theme-ui';

const GroceryListItemForm = ({
    category = '',
    item = '',
    quantity = '',
    unit = '',
    onSubmit,
    onCancel
}) => {
    return (
        <Form onSubmit={onSubmit} initialValues={{ category, item, quantity, unit }}>
            {({ handleSubmit, form }) => (
                <Box as="form" onSubmit={handleSubmit}>
                    <Flex>
                        <Field name="category">
                            {({ input }) => <Input placeholder="Category" {...input} />}
                        </Field>
                        <Field name="item">
                            {({ input }) => <Input placeholder="Item" {...input} />}
                        </Field>
                        <Field name="quantity" parse={(v) => (v === '' ? undefined : +v)}>
                            {({ input }) => (
                                <Input type="number" placeholder="Quantity" {...input} />
                            )}
                        </Field>
                        <Field name="unit">
                            {({ input }) => <Input placeholder="Unit" {...input} />}
                        </Field>
                        <Button type="submit">Submit</Button>
                        <Button
                            type="button"
                            onClick={() => {
                                form.reset();
                                onCancel();
                            }}
                        >
                            Cancel
                        </Button>
                    </Flex>
                </Box>
            )}
        </Form>
    );
};

export default GroceryListItemForm;
