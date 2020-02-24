import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { useIsMobile } from '../hooks/media';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { actions as reduxActions } from '../reducers/index';

const useStyles = makeStyles({
  content: {
    overflowY: 'hidden',
  },
});

interface ModalProps {
  isModalOpen: boolean;
  onModalClose: () => void;
  title?: string;
  children: any;
  actions?: any;
  onEnter?: () => void;
  onSubmit?: (e: any) => void;
}

const Modal: React.FC<ModalProps> = ({
  isModalOpen,
  onModalClose,
  title,
  children,
  actions,
  onEnter,
  onSubmit,
}) => {
  const isMobile = useIsMobile();
  const classes = useStyles({});
  const dispatch = useDispatch();

  return (
    <Dialog
      onClose={() => {
        onModalClose();
        dispatch(reduxActions.setAlert({
          severity: 'error',
          message: ''
        }))
      }}
      open={isModalOpen}
      fullScreen={isMobile}
      onEnter={onEnter}
      maxWidth="xs"
      fullWidth
    >
      <form
        onSubmit={e => {
          e.preventDefault();
          if (onSubmit) {
            onSubmit(e);
          }
        }}
      >
        {title && <DialogTitle>{title}</DialogTitle>}
        <DialogContent className={classes.content}>{children}</DialogContent>
        <DialogActions>
          <Button onClick={onModalClose} color="primary">
            Close
          </Button>
          {actions}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default Modal;
