import React, { useState } from 'react';
import Modal from './Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Message from './Message';
import { validateForm } from '../utils';
import { useDispatch } from 'react-redux';
import { actions } from '../reducers';
import { useAppSelector } from '../store';

interface ForgotModalProps {
  isForgotModalOpen: boolean;
  onForgotModalClose: () => void;
  handleBackClick: () => void;
}

const ForgotModal: React.FC<ForgotModalProps> = ({
  isForgotModalOpen,
  onForgotModalClose,
  handleBackClick,
}) => {
  const dispatch = useDispatch();
  const message = useAppSelector(state => state.alert.message);
  const severity = useAppSelector(state => state.alert.severity);

  const initialState = {
    email: '',
    emailHelpText: '',
  };

  const [formData, setFormData] = useState(initialState);

  const updateForm = (field, value) =>
    setFormData({ ...formData, [field]: value });

  const { email, emailHelpText } = formData;

  return (
    <Modal
      isModalOpen={isForgotModalOpen}
      onModalClose={() => {
        setFormData(initialState);
        dispatch(actions.userAlert({ message: '' }));
        onForgotModalClose();
      }}
      title="Forgot Password?"
      actions={
        <Button variant="contained" color="primary" type="submit">
          Reset Password
        </Button>
      }
      onSubmit={() => {
        const res = validateForm(formData);

        if (res.errorsFound) {
          return setFormData(res);
        }

        dispatch(actions.sendPasswordResetEmail(email));
      }}
    >
      <Grid container spacing={3}>
        <Message
          message={message}
          severity={severity}
          onClose={() => dispatch(actions.userAlert({ message: '' }))}
        />
        <Grid item xs={12}>
          <TextField
            autoFocus
            size="small"
            value={email}
            onChange={e => {
              updateForm('emailHelpText', '');
              updateForm('email', e.target.value);
            }}
            error={emailHelpText !== ''}
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            helperText={emailHelpText}
          />
        </Grid>
        <Grid justify="center" alignItems="center" item container xs={12}>
          <Button color="secondary" onClick={handleBackClick}>
            Go to sign in
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default ForgotModal;
