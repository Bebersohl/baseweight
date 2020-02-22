import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { fromCents } from '../utils';

const useStyles = makeStyles(theme => ({
  currencyCharacter: (props: any): any => ({
    color: theme.palette.grey[500],
    fontWeight: props.bold ? 600 : theme.typography.body1.fontWeight,
  }),
  text: (props: any): any => ({
    fontWeight: props.bold ? 600 : theme.typography.body1.fontWeight,
  }),
}));

interface FormatCurrencyProps {
  value: string | number;
  currencyCharacter?: string;
  bold?: boolean;
}

const FormatCurrency: React.FC<FormatCurrencyProps> = ({
  value,
  currencyCharacter = '$',
  bold = false,
}) => {
  const classes = useStyles({ bold });

  const displayCurrency =
    typeof value === 'string'
      ? value
      : fromCents(value)
          .toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })
          .replace('$', '');
  return (
    <Typography component="span" noWrap className={classes.text}>
      <Typography component="span" noWrap className={classes.currencyCharacter}>
        {currencyCharacter}
      </Typography>
      {displayCurrency}
    </Typography>
  );
};

export default React.memo(FormatCurrency);
