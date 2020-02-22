import React from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { toFixed } from '../utils';

const useStyles = makeStyles(theme => ({
  percent: {
    pointerEvents: 'none',
  },
}));

interface FormatPercentProps {
  value: number;
}

const FormatPercent: React.FC<FormatPercentProps> = ({ value }) => {
  const classes = useStyles({});
  const percentString = toFixed(value, 1) + '%';

  return (
    <Typography className={classes.percent} component="span">
      {percentString}
    </Typography>
  );
};

export default FormatPercent;
