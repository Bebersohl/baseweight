import React, { useEffect } from 'react';
import { RouteComponentProps } from '@reach/router';
import ItemList from '../components/ItemList';
import NotFoundScreen from '../screens/NotFoundScreen';
import { useAppSelector } from '../store';
import { listMapSelector } from '../selectors';
import { actions } from '../reducers';
import { useDispatch } from 'react-redux';
import LoadingContent from '../components/LoadingContent';

interface ListScreenProps {
  listId?: string;
}

const ListScreen: React.FC<ListScreenProps & RouteComponentProps> = ({
  listId = '',
}) => {
  const dispatch = useDispatch();

  const gearLists = useAppSelector(listMapSelector);

  const loadingMessage = useAppSelector(state => state.loading.message);

  const loadingModal = useAppSelector(state => state.loading.isModal);

  const userId = useAppSelector(state => state.user.id);

  const list = gearLists[listId];

  useEffect(() => {
    if (userId !== '') {
      dispatch(actions.getList(listId));
    }
  }, [listId, dispatch, userId]);

  if (userId === '' || (loadingMessage && !loadingModal)) {
    return <LoadingContent />;
  }

  if (!list) {
    return <NotFoundScreen />;
  }

  return (
    <div style={{ flexGrow: 1 }}>
      <ItemList listId={listId} />
    </div>
  );
};

export default ListScreen;
