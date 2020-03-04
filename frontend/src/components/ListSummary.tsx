import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SortBy, SortDirection, UnitType, GearListCategory } from '../types';
import { CategoryTotal, ListTotals } from '../utils';
import Row from './Row';
import FormatCurrency from './FormatCurrency';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import SortLabel from './SortLabel';
import { actions } from '../reducers';
import { useDispatch } from 'react-redux';
import WeightAndUnit from './WeightAndUnit';

const useStyles = makeStyles(() => {
  return {
    root: (props: any) => ({
      flexGrow: props.hide ? 0 : 1,
      maxWidth: 570,
      minWidth: props.hide ? 0 : 275,
    }),
    category: (props: any) => ({
      flexGrow: props.hide ? 0 : 1,
      minWidth: 100,
      flexShrink: 1,
      flexBasis: 180,
      overflow: 'hidden',
    }),
    price: (props: any) => ({
      flexBasis: 70,
      flexShrink: 0,
      textAlign: 'left',
      display: props.hide ? 'none' : 'block',
    }),
    weightHeader: (props: any) => ({
      flexBasis: 70,
      flexShrink: 0,
      textAlign: 'right',
      display: props.hide ? 'none' : 'block',
    }),
    total: (props: any) => ({
      minWidth: 100,
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 180,
      textAlign: 'right',
      display: props.hide ? 'hidden' : 'block',
    }),
  };
});

interface ListSummaryProps {
  editMode: boolean;
  categoryTotals: { [key: string]: CategoryTotal };
  listTotals: ListTotals;
  listId: string;
  sortedCategoryIds: string[];
  sortCategoriesBy: SortBy;
  sortCategoriesDirection: SortDirection;
  showPrices: boolean;
  categories: { [key: string]: GearListCategory };
  currencyCharacter: string;
  unitType: UnitType;
  hide: boolean;
}

const ListSummary: React.FC<ListSummaryProps> = ({
  editMode,
  categoryTotals,
  listTotals,
  listId,
  sortedCategoryIds,
  sortCategoriesBy,
  sortCategoriesDirection,
  showPrices,
  categories,
  currencyCharacter,
  unitType,
  hide,
}) => {
  const classes = useStyles({ showPrices, hide });

  const dispatch = useDispatch();

  return (
    <div className={classes.root}>
      <Row borderStyle="solid" fixedHeight>
        <div className={classes.category}>
          <SortLabel
            editMode={editMode}
            selected={sortCategoriesBy === 'name'}
            sortDirection={sortCategoriesDirection}
            onClick={() => {
              dispatch(
                actions.toggleCategorySort({
                  listId,
                  field: 'name',
                  direction: sortCategoriesDirection,
                })
              );
            }}
            flexDirection="row-reverse"
          >
            <Typography variant="body2">CATEGORY</Typography>
          </SortLabel>
        </div>
        {showPrices && (
          <div className={classes.price}>
            <SortLabel
              editMode={editMode}
              selected={sortCategoriesBy === 'price'}
              sortDirection={sortCategoriesDirection}
              flexDirection="row-reverse"
              onClick={() => {
                dispatch(
                  actions.toggleCategorySort({
                    listId,
                    field: 'price',
                    direction: sortCategoriesDirection,
                  })
                );
              }}
            >
              <Typography variant="body2">PRICE</Typography>
            </SortLabel>
          </div>
        )}
        <div className={classes.weightHeader}>
          <SortLabel
            editMode={editMode}
            selected={sortCategoriesBy === 'weight'}
            sortDirection={sortCategoriesDirection}
            onClick={() =>
              dispatch(
                actions.toggleCategorySort({
                  listId,
                  field: 'weight',
                  direction: sortCategoriesDirection,
                })
              )
            }
          >
            <Typography variant="body2">WEIGHT</Typography>
          </SortLabel>
        </div>
      </Row>
      {sortedCategoryIds.map((catId, index) => {
        const cat = categories[catId];

        const { totalPrice, totalWeight } = categoryTotals[catId];

        return (
          <Row
            fixedHeight
            key={catId}
            borderStyle={
              index === sortedCategoryIds.length - 1 ? 'solid' : 'dotted'
            }
          >
            <div className={classes.category}>
              <Link href={'#' + catId} color="inherit">
                <Typography noWrap>{cat.name}</Typography>
              </Link>
            </div>
            {showPrices && (
              <div className={classes.price}>
                <FormatCurrency
                  currencyCharacter={currencyCharacter}
                  value={totalPrice}
                />
              </div>
            )}
            <WeightAndUnit inputWeight={totalWeight} unitType={unitType} />
          </Row>
        );
      })}
      <div style={{ display: hide ? 'none' : 'block' }}>
        <Row fixedHeight>
          <div className={classes.total}>
            <Typography variant="body2">TOTAL</Typography>
          </div>
          {showPrices && (
            <div className={classes.price}>
              <FormatCurrency
                currencyCharacter={currencyCharacter}
                value={listTotals.totalPrice}
              />
            </div>
          )}
          <WeightAndUnit
            inputWeight={listTotals.totalWeight}
            unitType={unitType}
          />
        </Row>

        <Row fixedHeight>
          <div className={classes.total}>
            <Typography variant="body2">CONSUMABLE</Typography>
          </div>
          {showPrices && <div className={classes.price}></div>}
          <WeightAndUnit
            inputWeight={listTotals.consumableWeight}
            unitType={unitType}
          />
        </Row>

        <Row fixedHeight>
          <div className={classes.total}>
            <Typography variant="body2">WORN</Typography>
          </div>
          {showPrices && <div className={classes.price}></div>}
          <WeightAndUnit
            inputWeight={listTotals.wornWeight}
            unitType={unitType}
          />
        </Row>

        <Row fixedHeight>
          <div className={classes.total}>
            <Typography style={{ fontWeight: 600 }} variant="body2">
              BASE WEIGHT
            </Typography>
          </div>
          {showPrices && <div className={classes.price}></div>}
          <WeightAndUnit
            bold
            inputWeight={listTotals.baseWeight}
            unitType={unitType}
          />
        </Row>
      </div>
    </div>
  );
};

export default React.memo(ListSummary);
