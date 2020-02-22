import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { Collapse, Grid } from '@material-ui/core';
import { Severity } from '../types';

const useStyles = makeStyles({
  collapse: {
    paddingTop: 4,
  },
});

interface MessageProps {
  message: string;
  onClose: () => void;
  severity?: Severity;
}

const Message: React.FC<MessageProps> = ({
  message,
  severity = 'error',
  onClose,
}) => {
  const classes = useStyles({});

  return (
    <Grid item xs={12} style={{ paddingTop: 0, paddingBottom: 0 }}>
      <Collapse in={!!message} className={classes.collapse}>
        <Alert onClose={onClose} severity={severity}>
          {message}
        </Alert>
      </Collapse>
    </Grid>
  );
};

export default Message;
