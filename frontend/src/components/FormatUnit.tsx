import React from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Unit } from '../types';

const useStyles: any = makeStyles((theme): any => ({
  text: (props): any => ({
    fontWeight: props.bold ? 600 : theme.typography.body1.fontWeight,
  }),
}));

interface FormatUnitProps {
  unit: Unit
  bold?: boolean;
}

const FormatUnit: React.FC<FormatUnitProps> = ({
  unit,
  bold = false,
}) => {
  const classes = useStyles({ bold });

  return (
    <Typography className={classes.text} component="span" noWrap>
      {unit}
    </Typography>
  );
};

export default React.memo(FormatUnit);
