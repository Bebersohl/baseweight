import { User, Severity } from '../types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import { db, auth, googleAuthProvider } from '../firebase';
import { navigate } from '@reach/router';
import shortid from 'shortid';
import { actions } from '.';

const initialState: User = {
  id: '',
  displayName: '',
  providerId: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    clearUser: (state, action: PayloadAction<string>) => {
      state.displayName = '';
      state.id = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      return action.payload;
    },
    mergeUser: (state, action: PayloadAction<Partial<User>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    userAlert: (
      state,
      action: PayloadAction<{ message: string; severity?: Severity }>
    ) => {},
    userLoadingMessage: (state, action: PayloadAction<string>) => {},
    getUserStarted: (state, action: PayloadAction<string>) => {},
    setUserSnackMessage: (state, action: PayloadAction<string>) => {},
  },
});

export const {
  setUser,
  userAlert,
  userLoadingMessage,
  mergeUser,
  clearUser,
  getUserStarted,
  setUserSnackMessage,
} = userSlice.actions;

export const getUser = (userId: string): AppThunk => async dispatch => {
  try {
    dispatch(getUserStarted(userId));

    const res = await db
      .collection('users')
      .doc(userId)
      .get();

    if (!res.exists) {
      return dispatch(
        userAlert({ message: 'User not found', severity: 'error' })
      );
    }

    const user = res.data();

    dispatch(setUser(user as User));
  } catch (err) {
    dispatch(userAlert({ message: err, severity: 'error' }));
  }
};

export const updateUser = (newUserFields: Partial<User>): AppThunk => async (
  dispatch,
  getState
) => {
  try {
    if (!auth.currentUser) {
      return dispatch(
        userAlert({ message: 'User not found', severity: 'error' })
      );
    }

    if (newUserFields.displayName === getState().user.displayName) {
      return dispatch(
        userAlert({
          message: 'Update fields before submitting',
          severity: 'warning',
        })
      );
    }

    dispatch(userLoadingMessage('Updating profile'));

    await db
      .collection('users')
      .doc(auth.currentUser.uid)
      .set(newUserFields, { merge: true });

    dispatch(mergeUser(newUserFields));
  } catch (err) {
    dispatch(userAlert({ message: err.message, severity: 'error' }));
  } finally {
    dispatch(userLoadingMessage(''));
  }
};

export const sendPasswordResetEmail = (
  inputEmail?,
  waitForResponse = true
): AppThunk => async dispatch => {
  try {
    if (waitForResponse) {
      dispatch(userLoadingMessage('Sending password reset email'));
    }

    const email = inputEmail ? inputEmail : auth.currentUser?.email;

    if (!email) {
      return dispatch(
        userAlert({ message: 'User has no email', severity: 'error' })
      );
    }

    waitForResponse
      ? await auth.sendPasswordResetEmail(email)
      : auth.sendPasswordResetEmail(email);

    if (!waitForResponse) {
      return dispatch(setUserSnackMessage('Password reset email sent'));
    }

    dispatch(
      userAlert({ message: 'Password reset email sent', severity: 'success' })
    );
  } catch (err) {
    dispatch(userAlert({ message: err.message, severity: 'error' }));
  } finally {
    dispatch(userLoadingMessage(''));
  }
};

export const signIn = (email, password): AppThunk => async dispatch => {
  try {
    dispatch(userLoadingMessage('Signing in'));

    await auth.signInWithEmailAndPassword(email, password);
  } catch (err) {
    dispatch(userAlert({ message: err.message, severity: 'error' }));
  } finally {
    dispatch(userLoadingMessage(''));
  }
};

export const signOut = (): AppThunk => async dispatch => {
  try {
    dispatch(userLoadingMessage('Signing out'));

    dispatch(actions.saveLists());

    await navigate('/');

    await auth.signOut();
  } catch (err) {
    dispatch(userAlert({ message: err.message, severity: 'error' }));
  } finally {
    dispatch(userLoadingMessage(''));
  }
};

export const createUser = (
  email,
  password,
  displayName
): AppThunk => async dispatch => {
  try {
    dispatch(userLoadingMessage('Creating user'));

    const res = await auth.createUserWithEmailAndPassword(email, password);

    if (!res.user || !res.user.uid) {
      return dispatch(
        userAlert({ message: 'User not found', severity: 'error' })
      );
    }

    const newUser: User = {
      id: res.user.uid,
      displayName,
      providerId: 'password',
    };

    await db
      .collection('users')
      .doc(res.user.uid)
      .set(newUser);

    dispatch(setUser(newUser));
  } catch (err) {
    dispatch(userAlert({ message: err.message, severity: 'error' }));
  } finally {
    dispatch(userLoadingMessage(''));
  }
};

export const googleSignIn = (): AppThunk => async dispatch => {
  try {
    dispatch(userLoadingMessage('Signing in'));

    const res = await auth.signInWithPopup(googleAuthProvider);

    if (!res.user) {
      return dispatch(
        userAlert({ message: 'User not found', severity: 'error' })
      );
    }

    const newUser = {
      id: res.user.uid,
      displayName: res.user.displayName || 'Someone',
      providerId: 'google.com',
    };

    await db
      .collection('users')
      .doc(res.user.uid)
      .set(newUser);

    dispatch(setUser(newUser));
  } catch (err) {
    dispatch(userAlert({ message: err.message, severity: 'error' }));
  } finally {
    dispatch(userLoadingMessage(''));
  }
};

export const authChanged = (
  user: firebase.User | null
): AppThunk => async dispatch => {
  if (user) {
    dispatch(getUser(user.uid));
    dispatch(actions.getUserLists(user.uid));
    return;
  }

  if (!sessionStorage.getItem('userId')) {
    sessionStorage.setItem('userId', shortid.generate());
  }

  const userId = sessionStorage.getItem('userId') || 'unauthorized';

  dispatch(clearUser(userId));
};
