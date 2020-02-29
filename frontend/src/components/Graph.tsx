import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { GearListCategory } from '../types';
import { CategoryTotal, ListTotals, toFixed } from '../utils';
import FormatPercent from '../components/FormatPercent';

import Grow from '@material-ui/core/Grow';
import Tooltip from '@material-ui/core/Tooltip';
import Color from 'color';

const useStyles = makeStyles(theme => ({
  graph: (props: any) => {
    return {
      display: props.hide ? 'none' : 'flex',
      flexDirection: 'column',
      marginTop: 26,
      paddingLeft: 5,
      minWidth: 150,
      maxWidth: 325,
      flexGrow: 1,
    };
  },
  bar: {
    ...theme.typography.body1,
    height: 22,
    marginTop: 2,
    marginBottom: 2,
    alignSelf: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row-reverse',
    position: 'relative',
  },
  percent: {
    paddingLeft: 5,
    position: 'absolute',
    top: 1,
    left: 0,
    pointerEvents: 'none',
  },
}));

interface GraphProps {
  categoryTotals: { [key: string]: CategoryTotal };
  listTotals: ListTotals;
  sortedCategoryIds: string[];
  categories: { [key: string]: GearListCategory };
  hide: boolean;
}

const Graph: React.FC<GraphProps> = ({
  categoryTotals,
  listTotals,
  sortedCategoryIds,
  categories,
  hide,
}) => {
  const theme = useTheme();

  const classes = useStyles({ hide });

  const maxCatId = sortedCategoryIds.length
    ? sortedCategoryIds.reduce((acc, currCatId) => {
        return categoryTotals[acc].totalWeight >
          categoryTotals[currCatId].totalWeight
          ? acc
          : currCatId;
      })
    : '';

  return (
    <div className={classes.graph}>
      {sortedCategoryIds.map((catId, index) => {
        const category = categories[catId];

        const currentCatTotals = categoryTotals[catId];

        const percent =
          listTotals.totalWeight === 0
            ? 0
            : (currentCatTotals.totalWeight / listTotals.totalWeight) * 100;

        const wornPercent =
          currentCatTotals.totalWeight === 0
            ? 0
            : (currentCatTotals.totalWorn / currentCatTotals.totalWeight) * 100;

        const consumablePercent =
          currentCatTotals.totalWeight === 0
            ? 0
            : (currentCatTotals.totalConsumable /
                currentCatTotals.totalWeight) *
              100;

        const barWidth =
          categoryTotals[maxCatId].totalWeight === 0
            ? 0
            : (currentCatTotals.totalWeight /
                categoryTotals[maxCatId].totalWeight) *
              100;

        const wornWidth =
          currentCatTotals.totalWeight === 0
            ? 0
            : (currentCatTotals.totalWorn / currentCatTotals.totalWeight) * 100;

        const consumableWidth =
          currentCatTotals.totalWeight === 0
            ? 0
            : (currentCatTotals.totalConsumable /
                currentCatTotals.totalWeight) *
              100;

        const categoryColor =
          theme.palette.type === 'light'
            ? Color(category.color)
                .lighten(0.25)
                .hex()
            : category.color;

        const barStyle = {
          width: barWidth + '%',
          backgroundColor: categoryColor,
        };

        const darkenedCatColor = Color(categoryColor).darken(0.2);
        const lightenedCatColor = Color(categoryColor).lighten(0.2);

        const wornBarStyle = {
          width: wornWidth + '%',
          backgroundColor: categoryColor,
          height: 22,
          background: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 5px,
            ${lightenedCatColor} 5px,
            ${lightenedCatColor} 10px
          )`,
        };

        const consumableBarStyle = {
          width: consumableWidth + '%',
          backgroundColor: categoryColor,
          height: 22,
          background: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 5px,
            ${darkenedCatColor} 5px,
            ${darkenedCatColor} 10px
          )`,
        };
        return (
          <Grow in={true} key={catId} timeout={2000}>
            <div className={classes.bar} style={barStyle}>
              <span className={classes.percent}>
                {<FormatPercent value={percent} />}
              </span>
              <Tooltip title={`${toFixed(wornPercent, 1)}% Worn`}>
                <div style={wornBarStyle} />
              </Tooltip>
              <Tooltip title={`${toFixed(consumablePercent, 1)}% Consumable`}>
                <div style={consumableBarStyle} />
              </Tooltip>
            </div>
          </Grow>
        );
      })}
    </div>
  );
};

export default React.memo(Graph);
