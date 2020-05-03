import React from 'react';
import Moment from 'moment';
import { Heading, Flex, Box, Text, Button } from 'theme-ui';

import Link from '../../../../../../components/Link';

{
    /* <Heading as="h3">
    <Link to={`/app/plan/day/${moment.format('YYYY-MM-DD')}`}>
        {moment.format('ddd D').toUpperCase()}
    </Link>
</Heading> */
}

const WeekPlannerDayPlanHeading = ({ moment }) => {
    const isToday = moment.isSame(Moment(), 'day');

    return (
        <Flex mb={3} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
                <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
                    <Box>
                        <Text
                            variant="uppercase"
                            sx={{
                                fontSize: 0,
                                fontWeight: 'bold',
                                color: isToday ? 'accent1Palette.5' : 'greyPalette.8'
                            }}
                        >
                            {moment.format('ddd')}
                        </Text>
                    </Box>
                    <Box>
                        <Text
                            sx={{
                                fontSize: 5,
                                fontWeight: 'bold',
                                color: isToday ? 'accent1Palette.5' : 'greyPalette.8',
                                lineHeight: 'heading'
                            }}
                        >
                            {moment.format('D')}
                        </Text>
                    </Box>
                </Flex>
            </Box>
            <Box>
                <Button
                    as={Link}
                    to={`/app/plan/day/${moment.format('YYYY-MM-DD')}`}
                    sx={{
                        backgroundColor: 'transparent',
                        fontWeight: 'semibold',
                        boxShadow: 'none',
                        color: 'secondaryPalette.4',
                        '&:hover': {
                            backgroundColor: 'greyPalette.0'
                        }
                    }}
                >
                    Edit Recipes
                </Button>
            </Box>
        </Flex>
    );
};

export default WeekPlannerDayPlanHeading;
