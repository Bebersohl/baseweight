import React from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { toFixed } from '../utils';

const useStyles = makeStyles(theme => ({
  percent: (props: any) => ({
    pointerEvents: 'none',
    color: theme.palette.text.primary,
    ...(theme.palette.type === 'light' && {
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      borderRadius: 1,
    }),
  }),
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
