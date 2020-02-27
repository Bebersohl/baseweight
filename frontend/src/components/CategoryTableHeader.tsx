import React from 'react';
import Row from './Row';
import { SortBy, SortDirection } from '../types';
import Typography from '@material-ui/core/Typography';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import DeleteIcon from '@material-ui/icons/Delete';
import Checkbox from '@material-ui/core/Checkbox';
import EditableCell from './EditableCell';
import Tooltip from '@material-ui/core/Tooltip';
import SortLabel from './SortLabel';
import { rowStyles } from '../styles';
import { makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { actions } from '../reducers';
import { useAppSelector } from '../store';
import { showDescriptionsSelector } from '../selectors';

const useStyles = makeStyles(rowStyles);

interface CategoryTableHeaderProps {
  editMode: boolean;
  catId: string;
  isCategoryBoxChecked: boolean;
  toggleCategoryBox: (isCategoryBoxChecked: boolean) => void;
  lastAddedCatId: string;
  dragHandleProps: any;
  sortItemsDirection: SortDirection;
  sortItemsBy: SortBy;
  showCheckboxes: boolean;
  categoryName: string;
  showPrices: boolean;
  listId: string;
}

const CategoryTableHeader: React.FC<CategoryTableHeaderProps> = ({
  editMode,
  catId,
  isCategoryBoxChecked,
  toggleCategoryBox,
  lastAddedCatId,
  dragHandleProps,
  sortItemsDirection,
  sortItemsBy,
  showCheckboxes,
  categoryName,
  showPrices,
  listId,
}) => {
  const showDescriptions = useAppSelector(state =>
    showDescriptionsSelector(state, listId)
  );

  const classes = useStyles({ showDescriptions, editMode });

  const dispatch = useDispatch();

  return (
    <Row borderStyle="solid" editMode={editMode}>
      {editMode && (
        <div className={classes.drag}>
          <div {...dragHandleProps} className={classes.draggable}>
            <DragIndicatorIcon
              className="hiddenIcon icon"
              style={{ cursor: 'grab' }}
              fontSize="small"
            />
          </div>
        </div>
      )}

      {showCheckboxes && (
        <div className={classes.checkbox}>
          <Checkbox
            color="primary"
            size="small"
            disableFocusRipple
            disableTouchRipple
            className={classes.checkboxInput}
            checked={isCategoryBoxChecked}
            onChange={() => {
              dispatch(
                actions.toggleCategoryCheckboxes({
                  listId,
                  catId,
                  value: !isCategoryBoxChecked,
                })
              );
              toggleCategoryBox(!isCategoryBoxChecked);
            }}
          />
        </div>
      )}
      <div className={classes.nameHeader}>
        <SortLabel
          editMode={editMode}
          selected={sortItemsBy === 'name'}
          sortDirection={sortItemsDirection}
          onClick={() =>
            dispatch(
              actions.toggleItemSort({
                listId,
                field: 'name',
                direction: sortItemsDirection,
              })
            )
          }
          flexDirection="row-reverse"
        >
          <EditableCell
            textVariant="h6"
            editMode={editMode}
            value={categoryName}
            placeholder="Category"
            onBlur={e =>
              dispatch(
                actions.editCatName({ listId, catId, catName: e.target.value })
              )
            }
            lastAddedId={lastAddedCatId}
            catId={catId}
          >
            <Typography variant="h6">{categoryName}</Typography>
          </EditableCell>
        </SortLabel>
      </div>
      {showPrices && (
        <div className={classes.price}>
          <SortLabel
            editMode={editMode}
            selected={sortItemsBy === 'price'}
            sortDirection={sortItemsDirection}
            onClick={() =>
              dispatch(
                actions.toggleItemSort({
                  listId,
                  field: 'price',
                  direction: sortItemsDirection,
                })
              )
            }
            flexDirection="row-reverse"
          >
            <Typography variant="body2">PRICE</Typography>
          </SortLabel>
        </div>
      )}
      <div className={classes.weightHeader}>
        <SortLabel
          editMode={editMode}
          selected={sortItemsBy === 'weight'}
          sortDirection={sortItemsDirection}
          justifyContent="flex-end"
          onClick={() =>
            dispatch(
              actions.toggleItemSort({
                listId,
                field: 'weight',
                direction: sortItemsDirection,
              })
            )
          }
          flexDirection="row"
        >
          <Typography align="right" variant="body2">WEIGHT</Typography>
        </SortLabel>
      </div>
      {editMode && (
        <div className={classes.delete}>
          <Tooltip title="Delete Category">
            <DeleteIcon
              className="hiddenIcon"
              fontSize="small"
              onClick={() => {
                if (
                  window.confirm(
                    'Are you sure you want to delete this category? This cannot be undone.'
                  )
                ) {
                  dispatch(actions.removeCategory({ listId, catId }));
                }
              }}
            />
          </Tooltip>
        </div>
      )}
    </Row>
  );
};

export default React.memo(CategoryTableHeader);
