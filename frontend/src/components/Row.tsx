import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

function getHeight({ isMobile, fixedHeight, editMode, isHeader }) {
  if (fixedHeight) {
    return 26;
  }

  if (isMobile && editMode && !isHeader) {
    return 125;
  }

  return 'auto';
}

const useStyles = makeStyles(theme => ({
  drag: {
    flexBasis: 30,
  },
  row: (props: any): any => {
    const highlightColor =
      theme.palette.type === 'light' ? 'white' : theme.palette.grey[900];

    return {
      height: getHeight(props),
      flexWrap: props.wrap,
      '& .hiddenIcon': props => {
        if (props.editMode) {
          return {
            color: theme.palette.text.secondary,
            cursor: 'pointer',
            display: props.isMobile ? 'inline-block' : 'none',
          };
        }

        return {
          color: theme.palette.text.secondary,
          cursor: 'default',
          display: 'none',
        };
      },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      alignContent: 'space-between',
      borderBottom:
        props.borderStyle === 'none'
          ? 'none'
          : `1px ${props.borderStyle} ${theme.palette.grey[700]}`,
      padding: props.isMobile ? '7.5px 0 7.5px 0' : '2.5px 0 2.5px 0',
      flexDirection: 'row',
      '& div': {
        marginRight: 5,
      },
      '& div:last-child': {
        marginRight: 0,
      },
      '&:hover': props => ({
        '& input': {
          backgroundColor: highlightColor,
        },
        backgroundColor: highlightColor,
      }),
      '&:hover svg.hiddenIcon': props => {
        return {
          display: props.editMode ? 'inline-block' : 'none',
        };
      },
    };
  },
}));

interface RowProps {
  children: any;
  borderStyle?: string;
  editMode?: boolean;
  wrap?: string;
  fixedHeight?: boolean;
  isMobile?: boolean;
  isHeader?: boolean;
}

const Row: React.FC<RowProps> = ({
  children,
  borderStyle = 'dotted',
  editMode,
  wrap = 'nowrap',
  fixedHeight = false,
  isMobile = false,
  isHeader = false,
}) => {
  const classes = useStyles({
    borderStyle,
    editMode,
    wrap,
    fixedHeight,
    isMobile,
    isHeader,
  });

  return <div className={classes.row}>{children}</div>;
};

export default Row;
