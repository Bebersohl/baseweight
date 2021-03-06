import React from 'react';

import Typography from '@material-ui/core/Typography';
import { toFixed } from '../utils';
import { makeStyles } from '@material-ui/core/styles';

const useStyles: any = makeStyles((theme): any => ({
  text: (props): any => ({
    fontWeight: props.bold ? 600 : theme.typography.body1.fontWeight,
  }),
}));

interface FormatWeightProps {
  value: string | number;
  bold?: boolean;
}

const FormatWeight: React.FC<FormatWeightProps> = ({
  value,
  bold = false,
}) => {
  const classes = useStyles({ bold });

  const weight = typeof value === 'string' ? value : toFixed(value)

  return (
    <Typography className={classes.text} component="span" noWrap>
      {weight}
    </Typography>
  );
};

export default React.memo(FormatWeight);
