import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import Tooltip from '@material-ui/core/Tooltip';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import LinkIcon from '@material-ui/icons/Link';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    visibileIcon: (props: any) => ({
      color: theme.palette.primary.main,
      cursor: props.editMode ? 'pointer' : 'default',
    }),
  })
);

interface RowIconProps {
  onClick: () => void;
  isSelected: boolean;
  editMode: boolean;
  type: 'Consumable' | 'Worn' | 'Link';
}

function getIcon(type): any {
  if (type === 'Consumable') {
    return FastfoodIcon;
  }

  if (type === 'Worn') {
    return AccessibilityNewIcon;
  }

  return LinkIcon;
}
const RowIcon: React.FC<RowIconProps> = ({
  onClick,
  isSelected,
  editMode,
  type,
}) => {
  const classes = useStyles({ editMode });

  const Icon = getIcon(type);
  return (
    <Tooltip title={type}>
      <Icon
        onClick={!editMode ? undefined : onClick}
        fontSize="small"
        className={!isSelected ? 'hiddenIcon' : classes.visibileIcon}
      />
    </Tooltip>
  );
};

export default RowIcon;
