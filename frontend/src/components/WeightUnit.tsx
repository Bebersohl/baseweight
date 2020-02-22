import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { UnitType } from '../types';
import Typography from '@material-ui/core/Typography';
import { getDisplayUnit } from '../utils';

const useStyles: any = makeStyles((theme): any => ({
  unit: {
    color: theme.palette.grey[500],
    fontWeight: 600,
  },
}));

interface FormatWeightProps {
  value: string | number;
  unitType?: UnitType;
}

const WeightUnit: React.FC<FormatWeightProps> = ({ value, unitType }) => {
  const classes = useStyles({});

  const displayUnit = getDisplayUnit(value, unitType);

  return (
    <Typography noWrap component="span" className={classes.unit}>
      {displayUnit}
    </Typography>
  );
};

export default WeightUnit;
