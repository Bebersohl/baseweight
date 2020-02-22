import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SortDirection } from '../types';
import SortIcon from './SortIcon';

const useStyles = makeStyles(theme => ({
  label: (props: any): any => ({
    minHeight: 17.14,
    display: 'flex',
    alignItems: 'center',
    flexDirection: props.flexDirection,
    justifyContent: props.justifyContent,
    cursor: 'pointer',
    '&:hover': {
      '& svg': {
        display: 'inline-block',
        color: props.selected
          ? theme.palette.text.primary
          : theme.palette.grey[700],
      },
    },
  }),
}));

interface SortLabelProps {
  onClick: () => void;
  sortDirection: SortDirection;
  selected: boolean;
  justifyContent?: string;
  flexDirection?: string;
  editMode: boolean;
  children: any;
}

const SortLabel: React.FC<SortLabelProps> = ({
  onClick,
  sortDirection,
  children,
  selected,
  justifyContent = 'flex-end',
  flexDirection = 'row',
  editMode,
}) => {
  const classes = useStyles({
    justifyContent,
    flexDirection,
    selected,
    children,
  });

  if (editMode) {
    return children;
  }

  return (
    <div className={classes.label} onClick={onClick}>
      <SortIcon selected={selected} sortDirection={sortDirection} />
      {children}
    </div>
  );
};

export default SortLabel;
