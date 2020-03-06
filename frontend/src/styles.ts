import { Theme } from '@material-ui/core/styles';
const hideScroll = {
  overflow: 'scroll',
  '-ms-overflow-style': 'none',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar ': {
    width: 0,
    height: 0,
  },
};

const weightBasis = 50;
const unitBasis = 25;
const weightHeaderBasis = weightBasis + unitBasis + 5;
const iconBasis = 17;

export const rowStyles: any = (theme: Theme) => {
  return {
    draggable: props => ({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }),
    drag: props => ({
      flexBasis: iconBasis,
      flexShrink: 0,
      // backgroundColor: 'Cyan',
      // height: 20,
      [theme.breakpoints.down('sm')]: {
        order: 2,
      },
    }),
    dragHeader: props => ({
      flexBasis: iconBasis,
      flexShrink: 0,
      // backgroundColor: 'Cyan',
      // height: 20,
    }),
    checkbox: (props: any) => ({
      display: props.editMode ? 'none' : 'block',
      flexBasis: 20,
      flexShrink: 0,
      // backgroundColor: 'Chocolate',
      // height: 20,
    }),
    quantity: {
      flexBasis: 40,
      flexShrink: 0,
      display: 'flex',
      // backgroundColor: 'Coral',
      // height: 20,
      [theme.breakpoints.down('sm')]: {
        flexBasis: 20,
      },
    },
    nameHeader: props => {
      return {
        minWidth: 50,
        flexBasis: 165,
        flexShrink: 1,
        flexGrow: 1,
        whiteSpace: 'initial',
        // backgroundColor: 'CornflowerBlue',
        // height: 20,
        [theme.breakpoints.down('sm')]: {
          order: 2,
        },
      };
    },
    nameFooter: props => {
      return {
        minWidth: 100,
        flexBasis: 165,
        flexShrink: 1,
        flexGrow: 1,
        whiteSpace: 'initial',
        // backgroundColor: 'CornflowerBlue',
        // height: 20,
      };
    },
    break: {
      [theme.breakpoints.down('sm')]: {
        flexBasis: '100%',
        height: 0,
      },
    },
    name: props => ({
      minWidth: 80,
      flexBasis: 80,
      flexShrink: 1,
      flexGrow: 1,
      whiteSpace: 'initial',
      // backgroundColor: 'Crimson',
      // height: 20,
    }),
    description: props => ({
      minWidth: 80,
      flexBasis: 70,
      flexShrink: 1,
      flexGrow: 1,
      whiteSpace: 'initial',
      // backgroundColor: 'DarkBlue',
      // height: 20,
      [theme.breakpoints.down('sm')]: {
        order: 1,
        color: theme.palette.text.secondary,
        flexBasis: '100vw',
      },
    }),
    link: {
      flexBasis: iconBasis,
      flexShrink: 0,
      // backgroundColor: 'DarkCyan',
      // height: 20,
      [theme.breakpoints.down('sm')]: {
        order: 3,
      },
    },
    worn: {
      flexBasis: iconBasis,
      flexShrink: 0,
      // backgroundColor: 'DarkGoldenRod',
      // height: 20,
      [theme.breakpoints.down('sm')]: {
        order: 4,
      },
    },
    consumable: {
      flexBasis: iconBasis,
      flexShrink: 0,
      // backgroundColor: 'DarkGreen',
      // height: 20,
      [theme.breakpoints.down('sm')]: {
        order: 5,
      },
    },
    star: {
      flexBasis: iconBasis,
      flexShrink: 0,
      // backgroundColor: 'DarkMagenta',
      // height: 20,
      [theme.breakpoints.down('sm')]: {
        order: 6,
        marginRight: '0 !important',
      },
    },
    price: {
      ...hideScroll,
      flexBasis: 80,
      flexShrink: 0,
      // backgroundColor: 'DarkOliveGreen',
      // height: 20,
    },
    priceHeader: {
      flexBasis: 80,
      flexShrink: 0,
      // backgroundColor: 'DarkOliveGreen',
      // height: 20,
      [theme.breakpoints.down('sm')]: {
        order: 3,
      },
    },
    weight: {
      ...hideScroll,
      flexBasis: weightBasis,
      flexShrink: 0,
      textAlign: 'right',
      // backgroundColor: 'DarkOrchid',
      // height: 20,
    },
    weightHeader: props => ({
      flexBasis: weightHeaderBasis,
      flexShrink: 0,
      // backgroundColor: 'DarkRed',
      // height: 20,
      [theme.breakpoints.down('sm')]: {
        order: 4,
      },
    }),
    unit: {
      flexBasis: unitBasis,
      flexShrink: 0,
      textAlign: 'center',

      // backgroundColor: 'DarkSalmon',
      // height: 20,
      marginRight: '0 !important',
    },
    unitButton: {
      flexBasis: unitBasis,
      flexShrink: 0,
      display: 'flex',
      justifyContent: 'center',
      // backgroundColor: 'DarkSeaGreen',
      // height: 20,
    },
    delete: {
      flexBasis: iconBasis,
      flexShrink: 0,
      textAlign: 'right',
      // backgroundColor: 'DarkSlateBlue',
      // height: 20,
      marginRight: '0 !important',
      [theme.breakpoints.down('sm')]: {
        order: 7,
      },
    },
    deleteHeader: {
      flexBasis: iconBasis,
      flexShrink: 0,
      textAlign: 'right',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: 'DarkSlateBlue',
      // height: 20,
      [theme.breakpoints.down('sm')]: {
        paddingRight: 5,
        order: 1,
      },
    },
    deleteFooter: {
      flexBasis: iconBasis,
      flexShrink: 0,
      // backgroundColor: 'DarkSlateBlue',
      // height: 20,
      [theme.breakpoints.down('sm')]: {
        order: -1,
      },
    },
    checkboxInput: {
      background: 'transparent',
      width: 20,
      height: 20,
    },
    times: {
      display: 'inline-flex',
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'flex-end',
      marginLeft: 5,
    },
  };
};
