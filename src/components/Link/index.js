/** @jsx jsx */
import { jsx } from 'theme-ui';
import { Link as GatsbyLink } from 'gatsby';

// '&.active': {
//     color: 'primary'
// }
const Link = ({ sx, ...rest }) => (
    <GatsbyLink
        {...rest}
        activeClassName="active"
        sx={{
            ...sx,
            color: 'inherit'
        }}
    />
);

export default Link;
