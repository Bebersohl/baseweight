import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { blue, red, purple } from '@material-ui/core/colors';

const lightMode = {
  palette: {
    background: {
      paper: '#fff',
      default: '#f7f8fc',
    },
    secondary: {
      light: purple[200],
      main: purple[500],
      dark: purple[700],
    },
    type: 'light',
  },
};

const darkMode = {
  palette: {
    primary: {
      light: blue[100],
      main: blue[300],
      dark: blue[500],
    },
    secondary: {
      light: red[100],
      main: red[300],
      dark: red[500],
    },
    type: 'dark',
  },
};

const common = {
  typography: {
    fontSize: 12,
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: '.75rem',
      },
    },
  },
};
export const createTheme = paletteType => {
  let theme = {};

  if (paletteType === 'dark') {
    theme = {
      ...common,
      ...darkMode,
    };
  } else {
    theme = {
      ...common,
      ...lightMode,
    };
  }

  return responsiveFontSizes(createMuiTheme(theme));
};
