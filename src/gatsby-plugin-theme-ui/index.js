const baseColors = {
    transparent: 'transparent',
    white: '#fff',
    black: '#000'
};

const colorPalettes = {
    // -- Primary

    // Lime Green
    primaryPalette: [
        '#F2FDE0',
        '#E2F7C2',
        '#C7EA8F',
        '#ABDB5E',
        '#94C843',
        '#7BB026',
        '#63921A',
        '#507712',
        '#42600C',
        '#2B4005'
    ],

    // Orange
    secondaryPalette: [
        '#FFEFE6',
        '#FFD3BA',
        '#FAB38B',
        '#EF8E58',
        '#E67635',
        '#C65D21',
        '#AB4E19',
        '#8C3D10',
        '#77340D',
        '#572508'
    ],

    // -- Neutrals

    greyPalette: [
        '#F7F7F7',
        '#E1E1E1',
        '#CFCFCF',
        '#B1B1B1',
        '#9E9E9E',
        '#7E7E7E',
        '#626262',
        '#515151',
        '#3B3B3B',
        '#222222'
    ],

    // -- Supporting

    // Light Blue
    accent1Palette: [
        '#EBF8FF',
        '#D1EEFC',
        '#A7D8F0',
        '#7CC1E4',
        '#55AAD4',
        '#3994C1',
        '#2D83AE',
        '#1D6F98',
        '#166086',
        '#0B4F71'
    ],

    // Red
    accent2Palette: [
        '#FFEEEE',
        '#FACDCD',
        '#F29B9B',
        '#E66A6A',
        '#D64545',
        '#BA2525',
        '#A61B1B',
        '#911111',
        '#780A0A',
        '#610404'
    ],

    // Yellow
    accent3Palette: [
        '#FFFAEB',
        '#FCEFC7',
        '#F8E3A3',
        '#F9DA8B',
        '#F7D070',
        '#E9B949',
        '#C99A2E',
        '#A27C1A',
        '#7C5E10',
        '#513C06'
    ]
};

const commonButtonStyles = {
    py: 2,
    px: 3,
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: 'default',
    borderRadius: 'default'
};

const theme = {
    breakpoints: ['640px', '768px', '1024px', '1280px'],

    // text - body color
    // background - body background color
    // primary - primary button and link color
    // secondary - secondary color; can be used for hover states
    // accent - a contrast color for emphasizing UI
    // highlight - a background color for highlighting text
    // muted - a gray or subdued color for decorative purposes
    colors: {
        ...baseColors,
        ...colorPalettes,
        text: colorPalettes.greyPalette[8],
        background: baseColors.white,
        primary: colorPalettes.primaryPalette[5],
        secondary: colorPalettes.secondaryPalette[5],
        accent: colorPalettes.accent1Palette[5],
        highlight: colorPalettes.primaryPalette[2],
        muted: colorPalettes.greyPalette[1]
    },

    fonts: {
        body:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
        heading: 'inherit',
        monospace: 'Menlo, monospace'
    },
    fontSizes: [
        '0.875rem',
        '1rem',
        '1.25rem',
        '1.5rem',
        '1.875rem',
        '2.25rem',
        '3rem',
        '4rem',
        '4.5rem'
    ],
    fontWeights: {
        body: 400,
        semibold: 600,
        heading: 700,
        bold: 700
    },
    letterSpacings: {
        body: 'normal',
        uppercase: '0.025em'
    },
    lineHeights: {
        body: 1.5,
        heading: 1.125
    },
    radii: {
        none: 0,
        sm: '0.125rem',
        default: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        full: '50%'
    },
    shadows: {
        none: 'none',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        outline: '0 0 0 3px rgba(66, 153, 225, 0.5)',
        xs: '0 0 0 1px rgba(0, 0, 0, 0.05)',
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    space: [0, '0.25rem', '0.5rem', '1rem', '2rem', '4rem', '8rem', '16rem', '32rem'],

    // To add base, top-level styles to the <body> element, use theme.styles.root.
    styles: {
        root: {
            fontFamily: 'body',
            fontWeight: 'body',
            lineHeight: 'body'
        }
    },

    // -- Variants
    // https://github.com/system-ui/theme-ui/blob/master/packages/preset-tailwind/src/index.ts

    buttons: {
        primary: {
            ...commonButtonStyles,
            backgroundColor: 'primary',
            color: 'white',
            '&:hover': {
                backgroundColor: 'primaryPalette.6'
            }
        },
        secondary: {
            ...commonButtonStyles,
            backgroundColor: 'secondary',
            color: 'white',
            '&:hover': {
                backgroundColor: 'secondaryPalette.6'
            }
        },
        outline: {
            ...commonButtonStyles,
            backgroundColor: 'transparent',
            color: 'primary',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: 'primaryPalette.4',
            '&:hover': {
                backgroundColor: 'primaryPalette.6',
                color: 'white',
                borderColor: 'transparent'
            }
        }
    },
    cards: {
        primary: {
            p: 3,
            borderRadius: 'default',
            boxShadow: 'default'
        }
    },
    text: {
        heading: {
            fontFamily: 'heading',
            fontWeight: 'heading',
            lineHeight: 'heading'
        },
        uppercase: {
            letterSpacing: 'uppercase',
            textTransform: 'uppercase'
        }
    }
};

export default theme;
