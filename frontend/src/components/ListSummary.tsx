import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SortBy, SortDirection, UnitType, GearListCategory } from '../types';
import { CategoryTotal, ListTotals, getDisplayWeight } from '../utils';
import FormatWeight from './FormatWeight';
import FormatUnit from './FormatUnit';
import Row from './Row';
import FormatCurrency from './FormatCurrency';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import SortLabel from './SortLabel';
import { actions } from '../reducers';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles(() => {

  return {
    root: (props: any) => ({
      flexGrow: props.hide ? 0 : 1,
      maxWidth: 470,
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
      display: props.hide ? 'none' : 'block'
    }),
    weight: (props: any) => ({
      flexBasis: 51,
      flexShrink: 0,
      textAlign: 'right',
      display: props.hide ? 'none' : 'block'
    }),
    weightHeader: (props: any) => ({
      flexBasis: 71,
      flexShrink: 0,
      textAlign: 'right',
      display: props.hide ? 'none' : 'block'
    }),
    unit: (props: any) => ({
      flexBasis: 15,
      flexShrink: 0,
      textAlign: 'right',
      display: props.hide ? 'none' : 'block'
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

  const [totalWeight, totalWeightUnit] = getDisplayWeight(
    listTotals.totalWeight,
    unitType
  );
  const [consumableWeight, consumableWeightUnit] = getDisplayWeight(
    listTotals.consumableWeight,
    unitType
  );
  const [wornWeight, wornWeightUnit] = getDisplayWeight(
    listTotals.wornWeight,
    unitType
  );
  const [baseWeight, baseWeightUnit] = getDisplayWeight(
    listTotals.baseWeight,
    unitType
  );

  return (
    <div className={classes.root}>
      <Row borderStyle="solid">
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

        const [displayWeight, displayUnit] = getDisplayWeight(
          totalWeight,
          unitType
        );

        return (
          <Row
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
            <div className={classes.weight}>
              <FormatWeight value={displayWeight} />
            </div>
            <div className={classes.unit}>
              <FormatUnit unit={displayUnit} />
            </div>
          </Row>
        );
      })}
      <div style={{ display: hide ? 'none' : 'block' }}>
        <Row>
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
          <div className={classes.weight}>
            <FormatWeight value={totalWeight} />
          </div>
          <div className={classes.unit}>
            <FormatUnit unit={totalWeightUnit} />
          </div>
        </Row>

        <Row>
          <div className={classes.total}>
            <Typography variant="body2">CONSUMABLE</Typography>
          </div>
          {showPrices && <div className={classes.price}></div>}
          <div className={classes.weight}>
            <FormatWeight value={consumableWeight} />
          </div>
          <div className={classes.unit}>
            <FormatUnit unit={consumableWeightUnit} />
          </div>
        </Row>

        <Row>
          <div className={classes.total}>
            <Typography variant="body2">WORN</Typography>
          </div>
          {showPrices && <div className={classes.price}></div>}
          <div className={classes.weight}>
            <FormatWeight value={wornWeight} />
          </div>
          <div className={classes.unit}>
            <FormatUnit unit={wornWeightUnit} />
          </div>
        </Row>

        <Row>
          <div className={classes.total}>
            <Typography style={{ fontWeight: 600 }} variant="body2">
              BASE WEIGHT
            </Typography>
          </div>
          {showPrices && <div className={classes.price}></div>}
          <div className={classes.weight}>
            <FormatWeight bold value={baseWeight} />
          </div>
          <div className={classes.unit}>
            <FormatUnit unit={baseWeightUnit} />
          </div>
        </Row>
      </div>
    </div>
  );
};

export default React.memo(ListSummary);
