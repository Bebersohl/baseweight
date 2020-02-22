import React from 'react';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

interface OrDividerProps {}

const OrDivider: React.FC<OrDividerProps> = () => {
  return (
    <Grid
      spacing={1}
      item
      xs={12}
      container
      justify="center"
      alignItems="center"
      wrap="nowrap"
    >
      <Grid item xs={5}>
        <Divider style={{ width: '100%' }} />
      </Grid>
      <Grid item xs={2}>
        <Typography align="center">OR</Typography>
      </Grid>
      <Grid item xs={5}>
        <Divider style={{ width: '100%' }} />
      </Grid>
    </Grid>
  );
};

export default OrDivider;
