import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { GearListCategory } from '../types';
import { CategoryTotal, ListTotals, toFixed } from '../utils';
import FormatPercent from '../components/FormatPercent';

import Grow from '@material-ui/core/Grow';
import Tooltip from '@material-ui/core/Tooltip';
import Color from 'color';
import { useMediaQuery } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  graph: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 22,
    paddingLeft: 5,
    minWidth: 150,
    maxWidth: 325,
    flexGrow: 1,
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
}

const Graph: React.FC<GraphProps> = ({
  categoryTotals,
  listTotals,
  sortedCategoryIds,
  categories,
}) => {
  const showGraph = useMediaQuery('(max-width:425px)');

  const classes = useStyles({});

  if (showGraph) {
    return <></>;
  }

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

        const barStyle = {
          width: barWidth + '%',
          backgroundColor: category.color,
        };

        const darkenedCatColor = Color(category.color).darken(0.2);
        const lightenedCatColor = Color(category.color).lighten(0.2);

        const wornBarStyle = {
          width: wornWidth + '%',
          backgroundColor: category.color,
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
          backgroundColor: 'pink',
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
