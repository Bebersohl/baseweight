import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import Tooltip from '@material-ui/core/Tooltip';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import LinkIcon from '@material-ui/icons/Link';
import StarIcon from '@material-ui/icons/Star';
import { Starred } from '../types';

const useStyles = makeStyles((theme: Theme) => {
  const starMap = {
    red: theme.palette.error.light,
    green: theme.palette.success.light,
    blue: theme.palette.primary.main,
  };

  return createStyles({
    visibileIcon: (props: any) => ({
      color:
        props.type === 'Star'
          ? starMap[props.starred]
          : theme.palette.primary.main,
      cursor: props.editMode ? 'pointer' : 'default',
    }),
  });
});
type RowIconType = 'Consumable' | 'Worn' | 'Link' | 'Star';

interface RowIconProps {
  onClick: () => void;
  isSelected?: boolean;
  starred?: Starred;
  editMode: boolean;
  type: RowIconType;
  iconSize: 'small' | 'default' | 'large';
}

function getIcon(type): any {
  if (type === 'Consumable') {
    return FastfoodIcon;
  }

  if (type === 'Worn') {
    return AccessibilityNewIcon;
  }

  if (type === 'Star') {
    return StarIcon;
  }

  return LinkIcon;
}

function getIsSelected(
  type: RowIconType,
  starred: Starred | undefined,
  isSelected: Boolean | undefined
) {
  if (type !== 'Star') {
    return isSelected;
  }

  return starred !== 'none';
}

const RowIcon: React.FC<RowIconProps> = ({
  onClick,
  isSelected,
  starred,
  editMode,
  type,
  iconSize,
}) => {
  const classes = useStyles({ editMode, type, starred });

  const Icon = getIcon(type);
  return (
    <Tooltip title={type}>
      <Icon
        onClick={!editMode ? undefined : onClick}
        fontSize={iconSize}
        className={
          !getIsSelected(type, starred, isSelected)
            ? 'hiddenIcon'
            : classes.visibileIcon
        }
      />
    </Tooltip>
  );
};

export default RowIcon;
