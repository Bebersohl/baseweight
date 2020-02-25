import React from 'react';

import Typography from '@material-ui/core/Typography';
import { fromGrams, getDisplayUnit, toFixed } from '../utils';
import { makeStyles } from '@material-ui/core/styles';
import { UnitType, Unit } from '../types';

const useStyles: any = makeStyles((theme): any => ({
  unit: (props): any => ({
    color: theme.palette.grey[700],
    fontWeight: props.bold ? 600 : theme.typography.body1.fontWeight,
  }),
  text: (props): any => ({
    fontWeight: props.bold ? 600 : theme.typography.body1.fontWeight,
  }),
}));

interface FormatWeightProps {
  value: string | number;
  unitType?: UnitType;
  unit?: Unit;
  bold?: boolean;
  showUnit?: boolean;
}

const FormatWeight: React.FC<FormatWeightProps> = ({
  value,
  unitType,
  unit,
  bold = false,
  showUnit = true,
}) => {
  const classes = useStyles({ bold });
  const displayUnit = unit ? unit : getDisplayUnit(value, unitType);
  const displayWeight =
    typeof value === 'string'
      ? value
      : toFixed(fromGrams(value, displayUnit));

  return (
    <Typography className={classes.text} component="span" noWrap>
      {displayWeight}{' '}
      {showUnit && (
        <Typography noWrap component="span" className={classes.unit}>
          {displayUnit}
        </Typography>
      )}
    </Typography>
  );
};

export default React.memo(FormatWeight);
