import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { useAppSelector } from '../store';

const useStyles = makeStyles({
  root: (props: any): any => {
    if (!props.isModal) {
      return {
        position: 'fixed',
        top: '30%',
        left: '50%',
        transform: 'translateX(-50%)',
      };
    }
  },
  progress: {
    marginBottom: 30,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

interface LoadingModalProps {}

const LoadingContent: React.FC<LoadingModalProps> = () => {
  const isModal = useAppSelector(state => state.loading.isModal);

  const classes = useStyles({ isModal });

  const loadingMessage = useAppSelector(state => state.loading.message);

  if (!loadingMessage) {
    return <></>;
  }

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <CircularProgress
          className={classes.progress}
          thickness={4}
          size={50}
        />
        <Typography align="center">{loadingMessage}</Typography>
      </div>
    </div>
  );
};

export default LoadingContent;
