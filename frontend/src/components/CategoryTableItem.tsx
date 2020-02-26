import React, { useCallback } from 'react';
import Row from './Row';
import FormatCurrency from './FormatCurrency';
import FormatWeight from './FormatWeight';
import Typography from '@material-ui/core/Typography';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import DeleteIcon from '@material-ui/icons/Delete';
import StarredIcon from './StarredIcon';
import Checkbox from '@material-ui/core/Checkbox';
import EditableCell from './EditableCell';
import Tooltip from '@material-ui/core/Tooltip';
import UnitButton from './UnitButton';
import RowIcon from './RowIcon';
import FormatUnit from './FormatUnit';
import { Link } from '@material-ui/core';
import { GearItem, GearListCategory, UnitType } from '../types';
import { makeStyles } from '@material-ui/core/styles';
import { rowStyles } from '../styles';
import { actions } from '../reducers';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../store';
import { showDescriptionsSelector, showQuantitiesSelector } from '../selectors';

const useStyles = makeStyles(rowStyles);

interface CategoryTableItemProps {
  categoryColor: string;
  catId: string;
  editMode: boolean;
  openHyperlinkModal: (gearId: GearItem, catId: string) => void;
  dragHandleProps: any;
  category: GearListCategory;
  item: GearItem;
  gearId: string;
  lastAddedId: string;
  listId: string;
  showCheckboxes: boolean;
  showPrices: boolean;
  currencyCharacter: string;
  unitType: UnitType;
  lastItem: boolean;
}

const CategoryTableItem: React.FC<CategoryTableItemProps> = props => {
  const {
    editMode,
    categoryColor,
    dragHandleProps,
    item,
    gearId,
    lastAddedId,
    openHyperlinkModal,
    catId,
    listId,
    showCheckboxes,
    showPrices,
    currencyCharacter,
    unitType,
    lastItem,
  } = props;

  const showQuantities = useAppSelector(state =>
    showQuantitiesSelector(state, listId)
  );

  const showDescriptions = useAppSelector(state =>
    showDescriptionsSelector(state, listId)
  );

  const dispatch = useDispatch();

  const classes = useStyles({ showDescriptions, editMode });

  const weightInputRef = React.useRef();

  const priceInputRef = React.useRef();

  const onNameBlur = useCallback(
    e =>
      dispatch(
        actions.updateItem({
          listId,
          catId,
          gearId,
          field: 'name',
          value: e.target.value,
        })
      ),
    [listId, catId, gearId, dispatch]
  );

  const onQuantityBlur = useCallback(
    e =>
      dispatch(
        actions.updateItem({
          listId,
          catId,
          gearId,
          field: 'quantity',
          value: e.target.value,
        })
      ),
    [listId, catId, gearId, dispatch]
  );

  const onDescriptionBlur = useCallback(
    e =>
      dispatch(
        actions.updateItem({
          listId,
          catId,
          gearId,
          field: 'description',
          value: e.target.value,
        })
      ),
    [listId, catId, gearId, dispatch]
  );

  const onPriceBlur = useCallback(
    e =>
      dispatch(
        actions.updateItem({
          listId,
          catId,
          gearId,
          field: 'price',
          value: e.target.value,
        })
      ),
    [listId, catId, gearId, dispatch]
  );

  const onWeightBlur = useCallback(
    e =>
      dispatch(
        actions.updateItem({
          listId,
          catId,
          gearId,
          field: 'weight',
          value: e.target.value,
        })
      ),
    [listId, catId, gearId, dispatch]
  );

  const onUnitChange = useCallback(
    () =>
      dispatch(
        actions.toggleUnit({
          listId,
          catId,
          gearId,
        })
      ),
    [listId, catId, gearId, dispatch]
  );

  function renderItemName(item: GearItem) {
    if (editMode || !item.hyperlink) {
      return <Typography>{item.name}</Typography>;
    }

    return (
      <Link href={item.hyperlink} target="_blank">
        <Typography>{item.name}</Typography>
      </Link>
    );
  }

  return (
    <Row
      editMode={editMode}
      borderStyle={lastItem ? 'solid' : 'dotted'}
      borderLeftColor={categoryColor}
    >
      {editMode && (
        <div className={classes.drag}>
          <div {...dragHandleProps} className={classes.draggable}>
            <DragIndicatorIcon
              className="hiddenIcon"
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
            checked={item.checked}
            onChange={() =>
              dispatch(actions.toggleCheckItem({ listId, catId, gearId }))
            }
          />
        </div>
      )}
      {showQuantities && (
        <div className={classes.quantity}>
          <EditableCell
            type="quantity"
            placeholder=""
            editMode={editMode}
            value={item.quantity?.toString() || '1'}
            onBlur={onQuantityBlur}
          >
            <>
              <Typography display="inline">{item.quantity || '1'}</Typography>
              <span className={classes.times}>&times;</span>
            </>
          </EditableCell>
        </div>
      )}
      <div className={classes.name}>
        <EditableCell
          autoComplete
          gearId={gearId}
          editMode={editMode}
          value={item.name}
          placeholder="name"
          lastAddedId={lastAddedId}
          listId={listId}
          catId={catId}
          weightRef={weightInputRef}
          priceRef={priceInputRef}
          onBlur={onNameBlur}
        >
          {renderItemName(item)}
        </EditableCell>
      </div>
      {showDescriptions && (
        <div className={classes.description}>
          <EditableCell
            editMode={editMode}
            value={item.description}
            placeholder="description"
            onBlur={onDescriptionBlur}
          >
            <Typography>{item.description}</Typography>
          </EditableCell>
        </div>
      )}
      {editMode && (
        <div className={classes.link}>
          <RowIcon
            type="Link"
            editMode={editMode}
            onClick={() => openHyperlinkModal(item, catId)}
            isSelected={!!item.hyperlink}
          />
        </div>
      )}
      <div className={classes.worn}>
        <RowIcon
          type="Worn"
          editMode={editMode}
          onClick={() => {
            dispatch(actions.toggleWorn({ listId, catId, gearId }));
          }}
          isSelected={item.worn}
        />
      </div>
      <div className={classes.consumable}>
        <RowIcon
          type="Consumable"
          editMode={editMode}
          onClick={() =>
            dispatch(actions.toggleConsumable({ listId, catId, gearId }))
          }
          isSelected={item.consumable}
        />
      </div>
      <div className={classes.star}>
        <StarredIcon
          editMode={editMode}
          onClick={() =>
            dispatch(actions.toggleStarred({ listId, catId, gearId }))
          }
          starred={item.starred}
        />
      </div>
      {showPrices && (
        <div className={classes.price}>
          <EditableCell
            type="price"
            currencyCharacter={currencyCharacter}
            editMode={editMode}
            value={item.price.toString()}
            placeholder="price"
            onBlur={onPriceBlur}
            inputRef={priceInputRef}
          >
            <FormatCurrency
              currencyCharacter={currencyCharacter}
              value={item.price}
            />
          </EditableCell>
        </div>
      )}
      <div className={classes.weight}>
        <EditableCell
          key={item.id + unitType}
          type="weight"
          editMode={editMode}
          value={item.weight.toString()}
          placeholder="weight"
          inputRef={weightInputRef}
          onBlur={onWeightBlur}
        >
          <FormatWeight value={item.weight} />
        </EditableCell>
      </div>
      {editMode ? (
        <div className={classes.unitButton}>
          <UnitButton onChange={onUnitChange} value={item.unit} />
        </div>
      ) : (
        <div className={classes.unit}>
          <FormatUnit unit={item.unit} />
        </div>
      )}
      {editMode && (
        <div className={classes.delete}>
          <Tooltip title="Delete Item">
            <DeleteIcon
              className="hiddenIcon"
              fontSize="small"
              onClick={() =>
                dispatch(actions.removeItem({ listId, catId, gearId }))
              }
            />
          </Tooltip>
        </div>
      )}
    </Row>
  );
};

export default CategoryTableItem;
