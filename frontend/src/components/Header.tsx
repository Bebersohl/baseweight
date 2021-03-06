import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AppDrawer from './AppDrawer';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';
import SignInModal from './SignInModal';
import SignUpModal from './SignUpModal';
import ForgotModal from './ForgotModal';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ProfileModal from './ProfileModal';
import { Menu, MenuItem } from '@material-ui/core';
import { Location } from '@reach/router';
import { useDispatch } from 'react-redux';
import { actions } from '../reducers';
import { useAppSelector } from '../store';
import ToggleDarkButton from './ToggleDarkButton';
import { isUserSignedIn } from '../utils';
import { useIsMobile } from '../hooks/media';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolBar: {
      [theme.breakpoints.up('sm')]: {
        height: 40,
        minHeight: 40,
        '@media (min-width:0px) and (orientation: landscape)': {
          minHeight: 40,
        },
        '@media (min-width:600px)': {
          minHeight: 40,
        },
      },
    },
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    space: {
      flexGrow: 1,
    },
    accountButton: {
      textTransform: 'none',
    },
  })
);

interface HeaderProps {
  paletteType: 'light' | 'dark';
  onPaletteTypeChange: () => void;
}

const Header: React.FC<HeaderProps> = ({
  paletteType,
  onPaletteTypeChange,
}) => {
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);

  const isSignInModalOpen = useAppSelector(state => state.modals.signIn);
  const isForgotModalOpen = useAppSelector(state => state.modals.forgot);
  const isProfileModalOpen = useAppSelector(state => state.modals.profile);
  const isSignUpModalOpen = useAppSelector(state => state.modals.signUp);
  const userId = useAppSelector(state => state.user.id);
  const providerId = useAppSelector(state => state.user.providerId);
  const displayName = useAppSelector(state => state.user.displayName);

  const dispatch = useDispatch();

  const [anchorMenuEl, setAnchorMenuEl] = React.useState<null | HTMLElement>(
    null
  );

  const isMobile = useIsMobile();

  // const iconSize = isMobile ? 'medium' : 'small';

  // const fontSize = isMobile ? 'large' : 'default';

  const classes = useStyles({});

  const handleMenuClose = () => {
    setAnchorMenuEl(null);
  };

  const theme = useTheme();

  return (
    <>
      <AppBar
        position="static"
        color={theme.palette.type === 'dark' ? 'default' : 'primary'}
        className="noPrint"
      >
        <Toolbar className={classes.toolBar}>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            className={classes.menuButton}
            edge="start"
            color="inherit"
          >
            <MenuIcon fontSize={isMobile ? 'large' : 'inherit'} />
          </IconButton>
          <div className={classes.space} />
          <ToggleDarkButton
            paletteType={paletteType}
            onPaletteTypeChange={onPaletteTypeChange}
          />
          {isUserSignedIn(userId) ? (
            <>
              <Button
                onClick={e => setAnchorMenuEl(e.currentTarget)}
                color="inherit"
                startIcon={<AccountCircleIcon fontSize="inherit" />}
                className={classes.accountButton}
              >
                {displayName}
              </Button>
              <Menu
                anchorEl={anchorMenuEl}
                keepMounted
                open={Boolean(anchorMenuEl)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    dispatch(
                      actions.toggleModal({ isOpen: true, modal: 'profile' })
                    );

                    handleMenuClose();
                  }}
                >
                  Update Profile
                </MenuItem>
                {providerId === 'password' && (
                  <MenuItem
                    onClick={() => {
                      dispatch(
                        actions.sendPasswordResetEmail(undefined, false)
                      );

                      handleMenuClose();
                    }}
                  >
                    Reset Password
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    dispatch(actions.signOut());

                    handleMenuClose();
                  }}
                >
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                onClick={() =>
                  dispatch(
                    actions.toggleModal({ isOpen: true, modal: 'signUp' })
                  )
                }
                color="inherit"
              >
                Sign Up
              </Button>
              <Button
                onClick={() =>
                  dispatch(
                    actions.toggleModal({ isOpen: true, modal: 'signIn' })
                  )
                }
                color="inherit"
              >
                Sign In
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Location>
        {({ location }) => (
          <AppDrawer
            pathname={location.pathname}
            isDrawerOpen={isDrawerOpen}
            onDrawerClose={() => setDrawerOpen(false)}
          />
        )}
      </Location>
      <ProfileModal
        isProfileModalOpen={isProfileModalOpen}
        onProfileModalClose={() =>
          dispatch(actions.toggleModal({ isOpen: false, modal: 'profile' }))
        }
      />
      <SignInModal
        isSignInModalOpen={isSignInModalOpen}
        onSignInModalClose={() =>
          dispatch(actions.toggleModal({ isOpen: false, modal: 'signIn' }))
        }
        handleSignUpClick={() => {
          dispatch(actions.toggleModal({ isOpen: true, modal: 'signUp' }));
          // dispatch(actions.toggleModal({isOpen: false, modal: 'signIn'}))
        }}
        handleForgotClick={() => {
          dispatch(actions.toggleModal({ isOpen: true, modal: 'forgot' }));
          // dispatch(actions.toggleModal({isOpen: false, modal: 'signIn'}))
        }}
      />
      <SignUpModal
        isSignUpModalOpen={isSignUpModalOpen}
        onSignUpModalClose={() =>
          dispatch(actions.toggleModal({ isOpen: false, modal: 'signUp' }))
        }
        handleSignInClick={() => {
          dispatch(actions.toggleModal({ isOpen: true, modal: 'signIn' }));
          // dispatch(actions.toggleModal({isOpen: false, modal: 'signUp'}))
        }}
      />
      <ForgotModal
        isForgotModalOpen={isForgotModalOpen}
        onForgotModalClose={() =>
          dispatch(actions.toggleModal({ isOpen: false, modal: 'forgot' }))
        }
        handleBackClick={() => {
          dispatch(actions.toggleModal({ isOpen: true, modal: 'signIn' }));
          // setForgotModalOpen(false);
        }}
      />
    </>
  );
};

export default Header;
