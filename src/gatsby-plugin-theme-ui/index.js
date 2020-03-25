import { polaris } from '@theme-ui/presets';

const theme = {
    ...polaris,
    colors: {
        ...polaris.colors,
        modes: {
            dark: {
                text: '#ffffff',
                background: '#060606',
                primary: '#33ccff',
                secondary: '#ee00ff',
                muted: '#191919',
                highlight: '#29112c',
                gray: '#999999',
                accent: '#cc00ff'
            },
            deep: {
                text: 'hsl(210, 50%, 96%)',
                background: 'hsl(230, 25%, 18%)',
                primary: 'hsl(260, 100%, 80%)',
                secondary: 'hsl(290, 100%, 80%)',
                highlight: 'hsl(260, 20%, 40%)',
                accent: 'hsl(290, 100%, 80%)',
                muted: 'hsla(230, 20%, 0%, 20%)',
                gray: 'hsl(210, 50%, 60%)'
            },
            swiss: {
                text: 'hsl(10, 20%, 20%)',
                background: 'hsl(10, 10%, 98%)',
                primary: 'hsl(10, 80%, 50%)',
                secondary: 'hsl(10, 60%, 50%)',
                highlight: 'hsl(10, 40%, 90%)',
                accent: 'hsl(250, 60%, 30%)',
                muted: 'hsl(10, 20%, 94%)',
                gray: 'hsl(10, 20%, 50%)'
            }
        }
    },
    buttons: {
        primary: {
            color: 'background',
            bg: 'primary',
            fontWeight: 'bold'
        }
    },
    cards: {
        primary: {
            padding: 3,
            borderRadius: 4,
            boxShadow: '0 0 8px rgba(0, 0, 0, 0.125)'
        }
    },
    styles: {
        root: {
            ...polaris.styles.root
        }
    }
};

export default theme;
