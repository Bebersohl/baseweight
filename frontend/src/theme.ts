import { createMuiTheme } from '@material-ui/core/styles';
import { blue, red, purple } from '@material-ui/core/colors';

const lightMode = {
  palette: {
    background: {
      paper: '#fff',
      default: "#f7f8fc"
    },
    secondary: {
      light: purple[200],
      main: purple[500],
      dark: purple[700],
    },
    type: 'light',
  },
}

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
      dark: red[500]
    },
    type: 'dark',
  },
}

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
  mixins: {
    toolbar: {
      minHeight: 40,
      '@media (min-width:0px) and (orientation: landscape)': {
        minHeight: 40,
      },
      '@media (min-width:600px)': {
        minHeight: 40,
      },
    },
  },
}
export const createTheme = (paletteType) => {
  if(paletteType === 'dark') {
    return createMuiTheme({
      ...common,
      ...darkMode
    } as any)
  }

  return createMuiTheme({
    ...common,
    ...lightMode,
  } as any)
}