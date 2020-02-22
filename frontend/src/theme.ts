import { createMuiTheme } from '@material-ui/core/styles';
import { blue, red } from '@material-ui/core/colors';

export default createMuiTheme({
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
  palette: {
    primary: {
      main: blue[300],
    },
    secondary: {
      main: red[300],
    },
    type: 'dark',
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
});
