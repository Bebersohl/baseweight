import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SortBy, SortDirection, UnitType, GearListCategory } from '../types';
import { CategoryTotal, ListTotals } from '../utils';
import FormatWeight from './FormatWeight';
import Row from './Row';
import FormatCurrency from './FormatCurrency';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import SortLabel from './SortLabel';
import { actions } from '../reducers';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles({
  root: (props: any) => ({
    flexGrow: 1,
    maxWidth: props.showPrices ? 420 : 335,
    minWidth: 275,
  }),
  category: {
    maxWidth: 250,
    flexGrow: 1,
    minWidth: 100,
    flexShrink: 1,
    flexBasis: 180,
    overflow: 'hidden',
  },
  price: {
    flexBasis: 80,
    flexShrink: 0,
    textAlign: 'left',
  },
  weight: {
    flexBasis: 80,
    flexShrink: 0,
    textAlign: 'right',
  },
  total: {
    maxWidth: 250,
    minWidth: 100,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 180,
    textAlign: 'right',
  },
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
}) => {
  const classes = useStyles({ showPrices });

  const dispatch = useDispatch();

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
        <div className={classes.weight}>
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
              <FormatWeight value={totalWeight} unitType={unitType} />
            </div>
          </Row>
        );
      })}
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
          <FormatWeight value={listTotals.totalWeight} unitType={unitType} />
        </div>
      </Row>

      <Row>
        <div className={classes.total}>
          <Typography variant="body2">CONSUMABLE</Typography>
        </div>
        {showPrices && <div className={classes.price}></div>}
        <div className={classes.weight}>
          <FormatWeight
            value={listTotals.consumableWeight}
            unitType={unitType}
          />
        </div>
      </Row>

      <Row>
        <div className={classes.total}>
          <Typography variant="body2">WORN</Typography>
        </div>
        {showPrices && <div className={classes.price}></div>}
        <div className={classes.weight}>
          <FormatWeight value={listTotals.wornWeight} unitType={unitType} />
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
          <FormatWeight
            bold
            value={listTotals.baseWeight}
            unitType={unitType}
          />
        </div>
      </Row>
    </div>
  );
};

export default React.memo(ListSummary);
