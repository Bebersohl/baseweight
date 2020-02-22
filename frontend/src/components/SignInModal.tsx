import React, { useState } from 'react';
import Modal from './Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import OrDivider from './OrDivider';
import GoogleButton from 'react-google-button';
import Message from './Message';
import { validateForm } from '../utils';
import { useDispatch } from 'react-redux';
import { actions } from '../reducers';
import { useAppSelector } from '../store';

interface SignInModalProps {
  isSignInModalOpen: boolean;
  onSignInModalClose: () => void;
  handleSignUpClick: () => void;
  handleForgotClick: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({
  isSignInModalOpen,
  onSignInModalClose,
  handleSignUpClick,
  handleForgotClick,
}) => {
  const dispatch = useDispatch();

  const message = useAppSelector(state => state.alert.message);
  const severity = useAppSelector(state => state.alert.severity);

  const initialState = {
    email: '',
    password: '',
    emailHelpText: '',
    passwordHelpText: '',
  };

  const [formData, setFormData] = useState(initialState);

  const updateForm = (field, value) =>
    setFormData({ ...formData, [field]: value });

  const { email, password, emailHelpText, passwordHelpText } = formData;

  return (
    <Modal
      isModalOpen={isSignInModalOpen}
      onModalClose={() => {
        setFormData(initialState);
        onSignInModalClose();
      }}
      title="Sign In"
      onSubmit={e => {
        const res = validateForm(formData);

        if (res.errorsFound) {
          return setFormData(res);
        }

        dispatch(actions.signIn(email, password));
      }}
      actions={
        <Button variant="contained" color="primary" type="submit">
          Sign In
        </Button>
      }
    >
      <Grid container spacing={3}>
        <Message
          severity={severity}
          onClose={() => dispatch(actions.userAlert({ message: '' }))}
          message={message}
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
            value={email}
            onChange={e => {
              updateForm('emailHelpText', '');
              updateForm('email', e.target.value);
            }}
            required
            autoFocus
            error={emailHelpText !== ''}
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            helperText={emailHelpText}
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
        <Grid
          justify="center"
          alignItems="center"
          item
          container
          direction="column"
          xs={12}
        >
          <Button color="secondary" onClick={handleSignUpClick}>
            Go to sign up
          </Button>
          <Button color="secondary" onClick={handleForgotClick}>
            Forgot Password?
          </Button>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default SignInModal;
