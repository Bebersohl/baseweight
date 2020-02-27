import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  drag: {
    flexBasis: 30,
  },
  row: (props: any): any => {
    const highlightColor =
      theme.palette.type === 'light' ? 'white' : theme.palette.grey[900];

    return {
      '& .hiddenIcon': props => ({
        color: theme.palette.text.secondary,
        cursor: props.editMode ? 'pointer' : 'default',
        display: 'none',
      }),
      display: 'flex',
      alignItems: 'center',
      borderBottom:
        props.borderStyle === 'none'
          ? 'none'
          : `1px ${props.borderStyle} ${theme.palette.grey[700]}`,
      padding: '2.5px 0 2.5px 0',
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
      '&:hover svg.hiddenIcon': props => ({
        display: props.editMode ? 'inline-block' : 'none',
      }),
    };
  },
}));

interface RowProps {
  children: any;
  borderStyle?: string;
  borderLeftColor?: string;
  editMode?: boolean;
}

const Row: React.FC<RowProps> = ({
  children,
  borderStyle = 'dotted',
  borderLeftColor = '',
  editMode,
}) => {
  const classes = useStyles({ borderStyle, editMode });

  return <div className={classes.row}>{children}</div>;
};

export default Row;
