import React from 'react';
import Button from '@material-ui/core/Button';
import shortid from 'shortid';
import Row from './Row';
import FormatCurrency from './FormatCurrency';
import AddIcon from '@material-ui/icons/Add';
import { UnitType } from '../types';
import { rowStyles } from '../styles';
import { makeStyles } from '@material-ui/core';
import { actions } from '../reducers';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../store';
import { showDescriptionsSelector } from '../selectors';
import WeightAndUnit from './WeightAndUnit';

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
      {editMode && <div className={classes.dragHeader}></div>}
      {showCheckboxes && <div className={classes.checkbox}></div>}
      <div className={classes.nameFooter}>
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
      <WeightAndUnit inputWeight={totalWeight} unitType={unitType} />
      {editMode && <div className={classes.deleteFooter}></div>}
    </Row>
  );
};

export default React.memo(CategoryTableFooter);
