import { createMuiTheme } from '@material-ui/core/styles';
import { blue, red } from '@material-ui/core/colors';

const lightMode = {
  palette: {
    background: {
      paper: '#fff',
      default: "#f7f8fc"
    },
    // primary: {
    //   main: prefersDarkMode ? blue[300] : indigo[500],
    // },
    // secondary: {
    //   main: prefersDarkMode ? red[300] : pink[500],
    // },
    type: 'light',
  },
}

const darkMode = {
  palette: {
    primary: {
      main: blue[300],
    },
    secondary: {
      main: red[300],
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
