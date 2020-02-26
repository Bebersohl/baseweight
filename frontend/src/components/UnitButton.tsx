import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Unit } from '../types';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  unitButton: {
    // backgroundColor: theme.palette.grey[800],
    minWidth: 35,
    textTransform: 'none',
    ...theme.typography.body1
  },
}));

interface UnitButtonProps {
  value: Unit;
  onChange: (e: any) => void;
}

const UnitButton: React.FC<UnitButtonProps> = ({
  value,
  onChange,
}) => {
  const classes = useStyles({});

  return (
  <Button className={classes.unitButton} size="small" onClick={onChange}>{value}</Button>
  );
};

export default React.memo(UnitButton);
