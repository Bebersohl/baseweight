import React, { useState } from 'react';
import Modal from './Modal';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Message from './Message';
import TextField from '@material-ui/core/TextField';
import { validateForm } from '../utils';
import { useAppSelector } from '../store';
import { useDispatch } from 'react-redux';
import { actions } from '../reducers';

interface ProfileModalProps {
  isProfileModalOpen: boolean;
  onProfileModalClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isProfileModalOpen,
  onProfileModalClose,
}) => {
  const dispatch = useDispatch();

  const userDisplayName = useAppSelector(state => state.user.displayName);
  const message = useAppSelector(state => state.alert.message);
  const severity = useAppSelector(state => state.alert.severity);

  const [formData, setFormData] = useState({
    displayName: '',
    displayNameHelpText: '',
  });

  const updateForm = (field, value) =>
    setFormData({ ...formData, [field]: value });

  const { displayName, displayNameHelpText } = formData;

  return (
    <Modal
      isModalOpen={isProfileModalOpen}
      onModalClose={() => {
        onProfileModalClose();
        dispatch(actions.userAlert({ message: '' }));
      }}
      onEnter={() => {
        setFormData({
          ...formData,
          displayName: userDisplayName,
        });
      }}
      title="Update Profile"
      onSubmit={() => {
        const res = validateForm(formData);

        if (res.errorsFound) {
          return setFormData(res);
        }

        dispatch(actions.updateUser({ displayName }));
      }}
      actions={[
        <Button
          key="updateUser"
          variant="contained"
          color="primary"
          type="submit"
        >
          Update Profile
        </Button>,
      ]}
    >
      <Grid container spacing={3}>
        <Message
          severity={severity}
          message={message}
          onClose={() => dispatch(actions.userAlert({ message: '' }))}
        />
        <Grid container item xs={12}>
          <TextField
            value={displayName}
            onChange={e => {
              updateForm('displayNameHelpText', '');
              updateForm('displayName', e.target.value);
            }}
            autoFocus
            required
            fullWidth
            label="Display name"
            type="text"
            helperText={displayNameHelpText}
          />
        </Grid>
      </Grid>
    </Modal>
  );
};

export default ProfileModal;
