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
const unitBasis = 15;
const unitButtonBasis = 35;
const weightHeaderEdit = weightBasis + unitButtonBasis + 5;
const weightHeaderView = weightBasis + unitBasis + 5;
const iconBasis = 17;

const width800 = '@media (max-width:800px)'

export const rowStyles: any = (theme: Theme) => {

  return {
    draggable: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      [width800]: {
        order: 1,
      },
    },
    drag: {
      flexBasis: iconBasis,
      flexShrink: 0,
      // backgroundColor: 'CadetBlue',
      // height: 20,
    },
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
      [width800]: {
        flexBasis: 20,
      }
    },
    nameHeader: props => {

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
      [width800]: {
        flexBasis: '100%',
        height: 0,
      }
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
      [width800]: {
        order: 1,
        color: theme.palette.text.secondary
      },
    }),
    link: {
      flexBasis: iconBasis,
      flexShrink: 0,
      // backgroundColor: 'DarkCyan',
      // height: 20,
      [width800]: {
        order: 2,
      },
    },
    worn: {
      flexBasis: iconBasis,
      flexShrink: 0,
      // backgroundColor: 'DarkGoldenRod',
      // height: 20,
      [width800]: {
        order: 3,
      },
    },
    consumable: {
      flexBasis: iconBasis,
      flexShrink: 0,
      // backgroundColor: 'DarkGreen',
      // height: 20,
      [width800]: {
        order: 4,
      },
    },
    star: {
      flexBasis: iconBasis,
      flexShrink: 0,
      // backgroundColor: 'DarkMagenta',
      // height: 20,
      [width800]: {
        order: 5,
        marginRight: '0 !important'
      },
    },
    price: {
      ...hideScroll,
      flexBasis: 80,
      flexShrink: 0,
      // backgroundColor: 'DarkOliveGreen',
      // height: 20,
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
      flexBasis: props.editMode ? weightHeaderEdit : weightHeaderView,
      flexShrink: 0,
      // backgroundColor: 'DarkRed',
      // height: 20,
    }),
    unit: {
      flexBasis: unitBasis,
      flexShrink: 0,
      textAlign: 'right',
      // backgroundColor: 'DarkSalmon',
      // height: 20,
      marginRight: '0 !important',
    },
    unitButton: {
      flexBasis: unitButtonBasis,
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
      marginRight: '0 !important'
    },
    checkboxInput: {
      background: 'transparent',
      width: 20,
      // height: 20,
    },
    times: {
      display: 'inline-flex',
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 5,
    },
  };
};
