import React, { useState } from 'react';
import Modal from './Modal';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import OrDivider from './OrDivider';
import Message from './Message';
import GoogleButton from 'react-google-button';
import { validateForm } from '../utils';
import { useDispatch } from 'react-redux';
import { actions } from '../reducers';
import { useAppSelector } from '../store';

interface SignUpModalProps {
  isSignUpModalOpen: boolean;
  onSignUpModalClose: any;
  handleSignInClick: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({
  isSignUpModalOpen,
  onSignUpModalClose,
  handleSignInClick,
}) => {
  const dispatch = useDispatch();

  const message = useAppSelector(state => state.alert.message);
  const severity = useAppSelector(state => state.alert.severity);

  const initialState = {
    email: '',
    password: '',
    emailHelpText: '',
    passwordHelpText: '',
    displayName: '',
    displayNameHelpText: '',
  };

  const [formData, setFormData] = useState(initialState);

  const updateForm = (field, value) =>
    setFormData({ ...formData, [field]: value });

  const {
    email,
    password,
    emailHelpText,
    passwordHelpText,
    displayName,
    displayNameHelpText,
  } = formData;

  return (
    <Modal
      isModalOpen={isSignUpModalOpen}
      onModalClose={() => {
        setFormData(initialState);
        onSignUpModalClose();
      }}
      title="Sign Up"
      actions={
        <Button variant="contained" color="primary" type="submit">
          Sign Up
        </Button>
      }
      onSubmit={() => {
        const res = validateForm(formData);

        if (res.errorsFound) {
          return setFormData(res);
        }

        dispatch(actions.createUser(email, password, displayName));
      }}
    >
      <Grid container spacing={3}>
        <Message
          onClose={() => dispatch(actions.userAlert({ message: '' }))}
          message={message}
          severity={severity}
        />
        <Grid item xs={12} container justify="center" alignItems="center">
          <GoogleButton
            onClick={() => {
              dispatch(actions.googleSignIn());
            }}
          />
        </Grid>
        <OrDivider />
        <Grid item xs={12}>
          <TextField
            size="small"
            autoFocus
            value={email}
            type="email"
            onChange={e => {
              updateForm('emailHelpText', '');
              updateForm('email', e.target.value);
            }}
            required
            error={emailHelpText !== ''}
            label="Email"
            variant="outlined"
            fullWidth
            helperText={emailHelpText}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            size="small"
            value={displayName}
            onChange={e => {
              updateForm('displayNameHelpText', '');
              updateForm('displayName', e.target.value);
            }}
            required
            error={displayNameHelpText !== ''}
            label="Display Name"
            variant="outlined"
            fullWidth
            helperText={displayNameHelpText}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            size="small"
            value={password}
            onChange={e => {
              updateForm('passwordHelpText', '');
              updateForm('password', e.target.value);
            }}
            required
            error={passwordHelpText !== ''}
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            helperText={passwordHelpText}
          />
        </Grid>
        <Grid justify="center" alignItems="center" item container xs={12}>
          <Button color="secondary" onClick={handleSignInClick}>
            Go to sign in
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default SignUpModal;
