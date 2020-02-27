import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Graph from './Graph';
import ListSummary from './ListSummary';
import Grid from '@material-ui/core/Grid';
import {
  getCategoryTotals,
  getListTotals,
  sortCategories,
  downloadFile,
  convertListToCsvString,
  createMarkup,
  isUserSignedIn,
} from '../utils';
import { GearItem } from '../types';
import CategoryTable from './CategoryTable';
import AddIcon from '@material-ui/icons/Add';
import { CATEGORY_COLORS } from '../constants';
import shortid from 'shortid';
import Switch from '@material-ui/core/Switch';
import SettingsModal from './SettingsModal';
import AddHyperlinkModal from './AddHyperlinkModal';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import EditableCell from './EditableCell';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SharePopover from './SharePopover';
import FileUploadInput from './FileUploadInput';
import ListMenu from './ListMenu';
import { auth } from '../firebase';
import filenamify from 'filenamify';
import { useAppSelector } from '../store';
import { useDispatch, shallowEqual } from 'react-redux';
import { actions } from '../reducers';
import { navigate } from '@reach/router';

const useStyles = makeStyles(theme => ({
  unitTypeButton: {
    width: 75,
  },
  viewDescription: {
    '& a': {
      color: theme.palette.primary.main,
      textDecoration: 'none',
    },
    '& a:hover': {
      textDecoration: 'underline',
    },
  },
  subtitle: {
   color: theme.palette.text.secondary
  },
  signInWarning: {
    color: theme.palette.error.main,
  },
  textarea: {
    backgroundColor: theme.palette.background.default,
    ...theme.typography.body1,
    padding: 15,
    color: theme.palette.text.primary,
    outline: 'none',
    width: '100%',
    borderColor: theme.palette.grey[700],
    borderRadius: 5,
  },
}));

interface ItemListProps {
  hideHeader?: boolean;
  listId: string;
}

const ItemList: React.FC<ItemListProps> = props => {
  const classes = useStyles({});

  const dispatch = useDispatch();

  const userId = useAppSelector(state => state.user.id);

  const editMode = useAppSelector(state => state.editMode);

  const list = useAppSelector(
    state => state.gearLists.gearListsMap[props.listId],
    shallowEqual
  );

  const { hideHeader = false } = props;

  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [hyperlinkItem, setHyperlinkItem] = useState<{
    gearItem: GearItem;
    catId: string;
  } | null>(null);
  const [lastAddedCatId, setlastAddedCatId] = useState('');

  const isListOwner = list.userId === userId;

  const categoryTotals = React.useMemo(
    () => getCategoryTotals(list.categories, list.categoryIds),
    [list.categories, list.categoryIds]
  );

  const setHyperlinkItemMemo = React.useCallback(
    (gearItem, catId) => setHyperlinkItem({ gearItem, catId }),
    []
  );

  const onSettingsModalClose = React.useCallback(
    () => setSettingsModalOpen(false),
    []
  );

  const onAddHyperlinkModalClose = React.useCallback(
    () => setHyperlinkItem(null),
    []
  );

  const sortedCategoryIds = editMode
    ? list.categoryIds
    : sortCategories(
        categoryTotals,
        list.categoryIds,
        list.sortCategoriesDirection,
        list.sortCategoriesBy,
        list.categories
      );

  const listTotals = React.useMemo(
    () => getListTotals(list.categories, list.categoryIds),
    [list.categories, list.categoryIds]
  );

  function onDragEnd(result) {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (result.type === 'item') {
      return dispatch(
        actions.swapItems({
          listId: list.id,
          sourceCatId: source.droppableId,
          destCatId: destination.droppableId,
          sourceIndex: source.index,
          destinationIndex: destination.index,
          draggableId,
        })
      );
    }

    dispatch(
      actions.swapCategories({
        listId: list.id,
        sourceIndex: source.index,
        destinationIndex: destination.index,
        draggableId,
      })
    );
  }

  function renderCategoryTables(sortedCategoryIds) {
    const categories = sortedCategoryIds.map((catId, index) => {
      const { totalPrice, totalWeight } = categoryTotals[catId];

      return (
        <CategoryTable
          category={list.categories[catId]}
          index={index}
          key={catId}
          categoryColor={CATEGORY_COLORS[index]}
          totalPrice={totalPrice}
          totalWeight={totalWeight}
          catId={catId}
          editMode={editMode}
          openHyperlinkModal={setHyperlinkItemMemo}
          lastAddedCatId={lastAddedCatId}
          listId={list.id}
          showCheckboxes={list.showCheckboxes}
          showPrices={list.showPrices}
          currencyCharacter={list.currencyCharacter}
          unitType={list.unitType}
          sortItemsBy={list.sortItemsBy}
          sortItemsDirection={list.sortItemsDirection}
        />
      );
    });

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="cat" type="category">
          {(droppableProvided, droppableSnapshot) => (
            <div ref={droppableProvided.innerRef}>
              {categories}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  return (
    <Grid container spacing={3} key={list.id}>
      <Grid item container>
        <Grid item md={8} sm={12}>
          {!hideHeader && (
            <>
              <EditableCell
                placeholder="List title"
                editMode={editMode}
                textVariant="h4"
                value={list.name}
                onBlur={e =>
                  dispatch(
                    actions.editListName({
                      listId: list.id,
                      name: e.target.value,
                    })
                  )
                }
              >
                <Typography variant="h4">
                  {list.name || 'List #' + list.id}
                </Typography>
              </EditableCell>
              {!isListOwner && list.ownerDisplayName && (
                <Typography variant="subtitle1" className={classes.subtitle}>
                  By {list.ownerDisplayName}
                </Typography>
              )}
              <Typography variant="subtitle1" className={classes.subtitle}>
                Last updated {new Date(list.lastUpdated).toLocaleString()}
              </Typography>
              {!auth.currentUser && isListOwner && (
                <Typography
                  variant="subtitle1"
                  className={classes.signInWarning}
                >
                  Sign in to save your changes
                </Typography>
              )}
              {auth.currentUser && isListOwner && editMode && (
                <Typography variant="subtitle1" className={classes.subtitle}>
                  {list.hasUnsavedData ? 'Save pending' : 'Saved'}
                </Typography>
              )}
            </>
          )}
        </Grid>
        <Grid
          item
          container
          md={4}
          sm={12}
          alignItems="center"
          justify="flex-end"
          className="noPrint"
        >
          <ListMenu
            isListOwner={isListOwner}
            handleCopyList={() => {
              const newListId = shortid.generate();

              dispatch(actions.copyList({ list, newListId, userId }));

              navigate('/list/' + newListId);
            }}
            handleExportList={() => {
              const data = convertListToCsvString(list);

              const fileTitle = filenamify(list.name) + '.csv';

              downloadFile(fileTitle, data);
            }}
            handleDeleteList={() => {
              if (
                window.confirm(
                  'Are you sure you want to delete this list? It cannot be undone.'
                )
              ) {
                if(isUserSignedIn(userId)) {
                  return dispatch(actions.deleteList(list.id));
                }

                dispatch(actions.deleteListState(list.id));

                navigate('/')
              }
            }}
          />
          <FileUploadInput list={list} />
          <Tooltip title="Settings">
            <IconButton
              color="secondary"
              onClick={() => setSettingsModalOpen(true)}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          <SharePopover />
          {isListOwner && (
            <Tooltip title={editMode ? 'Edit mode' : 'View mode'}>
              <Switch
                color="secondary"
                size="small"
                checked={editMode}
                onChange={() =>
                  dispatch(
                    actions.setEditMode({
                      editMode: !editMode,
                      listId: list.id,
                    })
                  )
                }
                value="edit"
              />
            </Tooltip>
          )}
          <Button
            color="secondary"
            className={classes.unitTypeButton}
            onClick={e =>
              dispatch(
                actions.updateUnitType({
                  listId: list.id,
                  unitType: list.unitType === 'metric' ? 'imperial' : 'metric',
                })
              )
            }
          >
            {list.unitType}
          </Button>
        </Grid>
      </Grid>
      <Grid item container spacing={3}>
        <Grid
          item
          container
          wrap="nowrap"
          md={12}
          lg={!editMode && !list.description ? 12 : 7}
        >
          <ListSummary
            editMode={editMode}
            categoryTotals={categoryTotals}
            listTotals={listTotals}
            listId={list.id}
            sortedCategoryIds={sortedCategoryIds}
            sortCategoriesBy={list.sortCategoriesBy}
            sortCategoriesDirection={list.sortCategoriesDirection}
            showPrices={list.showPrices}
            categories={list.categories}
            currencyCharacter={list.currencyCharacter}
            unitType={list.unitType}
          />
          <Graph
            categoryTotals={categoryTotals}
            listTotals={listTotals}
            sortedCategoryIds={sortedCategoryIds}
            categories={list.categories}
          />
        </Grid>
        <Grid item container md={12} lg={5}>
          {editMode ? (
            <TextareaAutosize
              onBlur={e =>
                dispatch(
                  actions.editDescription({
                    listId: list.id,
                    description: e.target.value,
                  })
                )
              }
              spellCheck="false"
              placeholder="List description"
              rows={8}
              defaultValue={list.description}
              className={classes.textarea}
            />
          ) : (
            <Typography
              className={classes.viewDescription}
              dangerouslySetInnerHTML={createMarkup(list.description)}
            />
          )}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {renderCategoryTables(sortedCategoryIds)}

        {editMode && (
          <Button
            onClick={() => {
              const catId = shortid.generate();
              dispatch(actions.addCategory({ listId: list.id, catId: catId }));
              setlastAddedCatId(catId);
            }}
            size="small"
            color="primary"
            startIcon={<AddIcon fontSize="small" />}
          >
            Add Category
          </Button>
        )}
      </Grid>

      <SettingsModal
        listId={list.id}
        showCheckboxes={list.showCheckboxes}
        showPrices={list.showPrices}
        isSettingsModalOpen={isSettingsModalOpen}
        onSettingsModalClose={onSettingsModalClose}
        currencyCharacter={list.currencyCharacter}
        isListOwner={isListOwner}
      />

      <AddHyperlinkModal
        hyperlinkItem={hyperlinkItem}
        onAddHyperlinkModalClose={onAddHyperlinkModalClose}
        listId={list.id}
      />
    </Grid>
  );
};

export default React.memo(ItemList);
