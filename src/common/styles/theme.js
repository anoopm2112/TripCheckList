import { mapping, light as lightTheme, dark as darkTheme } from '@eva-design/eva';
import colors from './lightTheme';

export const themes = {
    light: {
        ...lightTheme,
        colors,
    },
    dark: {
        ...darkTheme,
        colors: {
            ...colors,
            primary: '#BB86FC',
            success: '#03DAC6',
            warning: '#FFC107',
            danger: '#CF6679',
            // other color values for dark theme
        },
    },
};

export const mappingTheme = mapping(themes);
