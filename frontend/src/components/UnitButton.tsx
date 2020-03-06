import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Unit } from '../types';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  unitButton: (props: any) => ({
    minWidth: 25,
    maxHeight: 20,
    minHeight: 20,
    padding: 0,
    textTransform: 'none',
    ...theme.typography.body1,
    fontWeight: props.bold ? 600 : theme.typography.body1.fontWeight,
  }),
}));

interface UnitButtonProps {
  value: Unit;
  onChange: (e: any) => void;
  bold?: boolean;
}

const UnitButton: React.FC<UnitButtonProps> = ({
  value,
  onChange,
  bold = false,
}) => {
  const classes = useStyles({
    bold,
  });

  return (
    <Button className={classes.unitButton} size="small" onClick={onChange}>
      {value}
    </Button>
  );
};

export default React.memo(UnitButton);
