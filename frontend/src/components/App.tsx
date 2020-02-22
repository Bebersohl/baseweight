import React, { useEffect } from 'react';
import Header from './Header';
import Container from '../components/Container';
import Routes from './Routes';
import LoadingModal from './LoadingModal';
import Snackbar from '@material-ui/core/Snackbar';
import { useBeforeunload } from 'react-beforeunload';
import useInterval from '@use-it/interval';
import Alert from '@material-ui/lab/Alert';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../store';
import { actions } from '../reducers';
import { auth } from '../firebase';
import { unsavedChangesSelector } from '../selectors';

const App: React.FC = () => {
  const dispatch = useDispatch();

  const userId = useAppSelector(state => state.user.id);

  const hasUnsavedChanges = useAppSelector(unsavedChangesSelector);

  const snackMessage = useAppSelector(state => state.snackMessage);

  useInterval(() => userId.length > 13 && dispatch(actions.saveLists()), 10000);

  useBeforeunload(() => {
    if (hasUnsavedChanges) {
      return 'Leave site? Changes you made may not be saved.';
    }
  });

  useEffect(() => {
    auth.onAuthStateChanged(function(user) {
      dispatch(actions.authChanged(user));
    });

    dispatch(actions.getSuggestions());
  }, [dispatch]);

  return (
    <>
      <Header />
      <Container>
        <Routes />
      </Container>
      <LoadingModal />
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={!!snackMessage}
        autoHideDuration={6000}
        onClose={() => dispatch(actions.setUserSnackMessage(''))}
      >
        <Alert onClose={() => dispatch(actions.setUserSnackMessage(''))}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default App;
