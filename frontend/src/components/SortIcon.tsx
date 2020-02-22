import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { SortDirection } from '../types';

const useStyles = makeStyles({
  icon: (props: any) => ({
    display:
      props.selected && props.sortDirection !== 'custom'
        ? 'inline-block'
        : 'none',
  }),
});

interface SortIconProps {
  sortDirection: SortDirection;
  selected: boolean;
}

const SortIcon: React.FC<SortIconProps> = ({ sortDirection, selected }) => {
  const classes = useStyles({ selected, sortDirection });

  if (sortDirection === 'asc') {
    return <ArrowDropDownIcon fontSize="small" className={classes.icon} />;
  }

  if (sortDirection === 'desc') {
    return <ArrowDropUpIcon fontSize="small" className={classes.icon} />;
  }

  return <span className={classes.icon} />;
};

export default SortIcon;
