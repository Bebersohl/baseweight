import React from 'react';
import Button from '@material-ui/core/Button';
import shortid from 'shortid';
import Row from './Row';
import FormatCurrency from './FormatCurrency';
import FormatWeight from './FormatWeight';
import WeightUnit from './WeightUnit';
import AddIcon from '@material-ui/icons/Add';
import { UnitType } from '../types';
import { rowStyles } from '../styles';
import { makeStyles } from '@material-ui/core';
import { actions } from '../reducers';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../store';
import { showDescriptionsSelector } from '../selectors';

const useStyles = makeStyles(rowStyles);

interface CategoryTableFooterProps {
  editMode: boolean;
  setLastAddedId: (gearId: string) => void;
  catId: string;
  listId: string;
  unitType: UnitType;
  showCheckboxes: boolean;
  showPrices: boolean;
  currencyCharacter: string;
  totalPrice: number;
  totalWeight: number;
}

const CategoryTableFooter: React.FC<CategoryTableFooterProps> = ({
  editMode,
  setLastAddedId,
  catId,
  listId,
  unitType,
  showCheckboxes,
  showPrices,
  currencyCharacter,
  totalPrice,
  totalWeight,
}) => {
  const dispatch = useDispatch();

  const showDescriptions = useAppSelector(state =>
    showDescriptionsSelector(state, listId)
  );

  const classes = useStyles({ showDescriptions, editMode });

  return (
    <Row borderStyle="none" editMode={editMode}>
      {editMode && <div className={classes.drag}></div>}
      {showCheckboxes && <div className={classes.checkbox}></div>}
      <div className={classes.nameHeader}>
        {editMode && (
          <Button
            size="small"
            color="primary"
            startIcon={<AddIcon fontSize="small" />}
            onClick={() => {
              const gearId = shortid.generate();
              setLastAddedId(gearId);
              dispatch(actions.addItem({ listId, catId, gearId }));
            }}
          >
            Add Item
          </Button>
        )}
      </div>
      {showPrices && (
        <div className={classes.price}>
          <FormatCurrency
            bold
            currencyCharacter={currencyCharacter}
            value={totalPrice}
          />
        </div>
      )}
      <div
        className={classes.weight}
        style={{ textAlign: editMode ? 'right' : 'left' }}
      >
        <FormatWeight
          showUnit={!editMode}
          bold
          value={totalWeight}
          unitType={unitType}
        />
      </div>
      {editMode && (
        <div className={classes.unitSelect}>
          <WeightUnit value={totalWeight} unitType={unitType} />
        </div>
      )}
      {editMode && <div className={classes.delete}></div>}
    </Row>
  );
};

export default React.memo(CategoryTableFooter);