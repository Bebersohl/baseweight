import React, { useEffect, useState, useCallback } from 'react';
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
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { createTheme } from '../theme';
import { PaletteType } from '../types'

const App: React.FC = () => {
  const storedPalleteType = localStorage.getItem('paletteType')

  const paletteTypeDefault = storedPalleteType !== null ? storedPalleteType : 'dark'

  const [paletteType, setDarkMode] = useState<PaletteType>(paletteTypeDefault as PaletteType);

  const theme = React.useMemo(() => createTheme(paletteType), [
    paletteType,
  ]);

  const onPaletteTypeChange = useCallback(() => {
    setDarkMode((prev) => {

      const nextType = prev === 'light' ? 'dark' : 'light'

      localStorage.setItem('paletteType', nextType)
      return nextType
    });
  }, [])

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header paletteType={paletteType} onPaletteTypeChange={onPaletteTypeChange}/>
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
    </ThemeProvider>
  );
};

export default App;
