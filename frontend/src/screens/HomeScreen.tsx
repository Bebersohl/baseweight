import React, { useEffect } from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import Link from '@material-ui/core/Link';
import shortid from 'shortid';
import FileUploadInput from '../components/FileUploadInput';
import Typography from '@material-ui/core/Typography';
import ItemList from '../components/ItemList';
import { useAppSelector } from '../store';
import { actions } from '../reducers';
import { useDispatch } from 'react-redux';
import { listIdsSelector, listMapSelector } from '../selectors';
import LoadingContent from '../components/LoadingContent';

const HomeScreen: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();

  const gearListIds = useAppSelector(listIdsSelector);

  const gearLists = useAppSelector(listMapSelector);

  const userId = useAppSelector(state => state.user.id);

  const demoList = gearLists.demo;

  // show demo if user not signed in or user is signed in and has 0 lists
  useEffect(() => {
    if (userId !== '' && !(userId.length > 13 && gearListIds.length > 0)) {
      dispatch(actions.getList('demo'));
    }
  }, [userId, gearListIds.length, dispatch]);

  function startNewList() {
    const listId = shortid.generate();

    dispatch(actions.createList({ listId, userId }));

    navigate(`/list/${listId}`);
  }

  const firstListId = gearListIds[0];

  if (userId === '') {
    return <LoadingContent />;
  }

  if (userId.length > 13 && gearLists[firstListId]) {
    return <ItemList listId={firstListId} />;
  }

  return (
    <div style={{ flexGrow: 1 }}>
      <FileUploadInput
        onUploadComplete={list => {
          const newListId = shortid.generate();

          dispatch(actions.copyList({ list, newListId, userId }));

          navigate(`/list/${newListId}`);
        }}
      />
      <Typography variant="h4">Welcome!</Typography>
      <Typography variant="h6">
        You can{' '}
        <Link
          href="#"
          onClick={() => dispatch(actions.setEditMode({ editMode: true }))}
        >
          edit
        </Link>{' '}
        or{' '}
        <Link
          href="#"
          onClick={() => {
            const newListId = shortid.generate();
            dispatch(actions.copyList({ list: demoList, newListId, userId }));
            navigate('/list/' + newListId);
          }}
        >
          copy
        </Link>{' '}
        this demo list,{' '}
        <label htmlFor="file-upload-button">
          <Link style={{ cursor: 'pointer' }}>import</Link>
        </label>{' '}
        a CSV file, or{' '}
        <Link href="#" onClick={startNewList}>
          start
        </Link>{' '}
        from scratch.
      </Typography>

      {demoList ? (
        <ItemList hideHeader hideIcons listId="demo" />
      ) : (
        <Typography style={{ marginTop: 50 }} align="center" >Loading demo...</Typography>
      )}
    </div>
  );
};

export default HomeScreen;
