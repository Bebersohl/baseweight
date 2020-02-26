const hideScroll = {
  overflow: 'scroll',
  '-ms-overflow-style': 'none',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar ': {
    width: 0,
    height: 0,
  },
};

export const rowStyles: any = props => ({
  draggable: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drag: {
    flexBasis: 17,
    flexShrink: 0,
  },
  checkbox: {
    flexBasis: 20,
    flexShrink: 0,
  },
  quantity: {
    flexBasis: 40,
    flexShrink: 0,
    display: 'flex',
  },
  nameHeader: props => {
    let minWidth = 168;

    const { showDescriptions, editMode } = props;

    if (showDescriptions && !editMode) {
      minWidth = 231;
    }

    if (!showDescriptions && !editMode) {
      minWidth = 146;
    }

    if (showDescriptions && editMode) {
      minWidth = 253;
    }

    return {
      minWidth,
      flexBasis: 165,
      flexShrink: 1,
      flexGrow: 1,
      whiteSpace: 'initial',
    };
  },
  name: props => ({
    minWidth: 80,
    flexBasis: 200,
    flexShrink: 1,
    flexGrow: props.showDescriptions ? 0 : 1,
    whiteSpace: 'initial',
  }),
  description: props => ({
    minWidth: 80,
    flexBasis: 70,
    flexShrink: 1,
    flexGrow: props.showDescriptions ? 1 : 0,
    whiteSpace: 'initial',
  }),
  link: {
    flexBasis: 17,
    flexShrink: 0,
  },
  worn: {
    flexBasis: 17,
    flexShrink: 0,
  },
  consumable: {
    flexBasis: 17,
    flexShrink: 0,
  },
  star: {
    flexBasis: 17,
    flexShrink: 0,
  },
  price: {
    ...hideScroll,
    flexBasis: 80,
    flexShrink: 0,
  },
  weight: {
    ...hideScroll,
    flexBasis: 80,
    flexShrink: 0,
    textAlign: 'right',
  },
  weightHeader: props => ({
    flexBasis: props.editMode ? 80 : 100,
    flexShrink: 0,
  }),
  unit: {
    flexBasis: 15,
    flexShrink: 0,
    textAlign: 'right',
  },
  unitButton: {
    flexBasis: 35,
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'center'
  },
  delete: {
    flexBasis: 17,
    flexShrink: 0,
    textAlign: 'right',
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
    alignItems: 'center',
    marginLeft: 5
  },
});
