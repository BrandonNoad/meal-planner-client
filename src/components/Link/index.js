/** @jsx jsx */
import { jsx } from 'theme-ui';
import { Link as GatsbyLink } from 'gatsby';

const Link = ({ sx, ...rest }) => (
    <GatsbyLink
        {...rest}
        activeClassName="active"
        sx={{
            ...sx,
            color: 'inherit',
            '&.active': {
                color: 'primary'
            }
        }}
    />
);

export default Link;
