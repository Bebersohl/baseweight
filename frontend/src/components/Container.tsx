import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 15,
    paddingRight: 15,
    paddingLeft: 15,
    marginRight: 'auto',
    marginLeft: 'auto',
    [theme.breakpoints.up('md')]: {
      width: 700,
    },
    [theme.breakpoints.up('lg')]: {
      width: 850,
    },
    [theme.breakpoints.up('xl')]: {
      width: 970,
    },
  },
}));

interface ContainerProps {
  children: any;
}

const Container: React.FC<ContainerProps> = ({ children, ...rest }) => {
  const classes = useStyles({});

  return (
    <div className={classes.root} {...rest}>
      {children}
    </div>
  );
};

export default Container;
