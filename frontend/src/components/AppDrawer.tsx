import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import { navigate } from '@reach/router';
import shortid from 'shortid';
import { actions } from '../reducers';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../store';
import { listIdsSelector, listMapSelector } from '../selectors';

const useStyles = makeStyles({
  bugLink: {
    marginTop: 50,
  },
  ellipsis: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    maxWidth: 250,
  },
  version: {
    paddingLeft: 7,
  },
  title: {
    display: 'flex',
    alignItems: 'baseline',
  },
  create: {
    marginTop: 5,
  },
});

interface AppDrawerProps {
  isDrawerOpen: boolean;
  onDrawerClose: () => void;
  pathname: string;
}

const AppDrawer: React.FC<AppDrawerProps> = ({
  isDrawerOpen,
  onDrawerClose,
  pathname,
}) => {
  const dispatch = useDispatch();

  const userId = useAppSelector(state => state.user.id);

  const gearListIds = useAppSelector(listIdsSelector);

  const gearLists = useAppSelector(listMapSelector);

  const classes = useStyles({});

  const Title = (
    <>
      <div className={classes.title}>
        <Link
          variant="h6"
          href="#"
          onClick={() => {
            dispatch(actions.setEditMode({ editMode: false }))
            navigate('/');
            onDrawerClose();
          }}
          color="primary"
        >
          <Typography variant="h6">Baseweight.net</Typography>
        </Link>
        <Typography className={classes.version} variant="caption">
          v1.0
        </Typography>
      </div>
      <Link
        variant="body1"
        href="https://github.com/bebersohl/baseweight/issues"
        target="_blank"
        color="primary"
      >
        <Typography variant="subtitle1">Found a bug?</Typography>
      </Link>
    </>
  );

  const navigateToList = id => {
    navigate(`/list/${id}`);
    onDrawerClose();
  };

  return (
    <Drawer open={isDrawerOpen} onClose={onDrawerClose}>
      <List>
        <ListItem>
          <ListItemText primary={Title} />
        </ListItem>
        <Divider />
        <ListItem>
          <Button
            className={classes.create}
            onClick={() => {
              const listId = shortid.generate();

              dispatch(actions.createList({ listId, userId }));

              navigateToList(listId);
            }}
            variant="contained"
            fullWidth
            color="secondary"
          >
            Create List
          </Button>
        </ListItem>
        {gearListIds.map(id => {
          return (
            <ListItem
              button
              key={id}
              selected={pathname === '/list/' + id}
              onClick={() => {
                dispatch(actions.setEditMode({ editMode: false }));
                navigateToList(id);
              }}
            >
              <ListItemText
                className={classes.ellipsis}
                primary={gearLists[id].name || 'List #' + id}
              />
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default AppDrawer;
