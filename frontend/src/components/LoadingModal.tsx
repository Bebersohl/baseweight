import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import { useAppSelector } from '../store';
import LoadingContent from './LoadingContent';

const useStyles = makeStyles({
  root: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paper: {
    padding: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  progress: {
    marginBottom: 30,
  },
});

interface LoadingModalProps {}

const LoadingModal: React.FC<LoadingModalProps> = () => {
  const classes = useStyles({});

  const loadingMessage = useAppSelector(state => state.loading.message);

  const isLoadingModal = useAppSelector(state => state.loading.isModal);

  return (
    <Modal
      disableEnforceFocus
      disableAutoFocus
      disableBackdropClick
      disableEscapeKeyDown
      open={loadingMessage.length > 0 && isLoadingModal}
    >
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <LoadingContent />
        </Paper>
      </div>
    </Modal>
  );
};

export default LoadingModal;
