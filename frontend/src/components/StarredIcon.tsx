import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { Starred } from '../types';
import StarIcon from '@material-ui/icons/Star';

const useStyles = makeStyles((theme: Theme) => {
  const starMap = {
    red: theme.palette.error.light,
    green: theme.palette.success.light,
    blue: theme.palette.primary.main,
  };

  return createStyles({
    visibileIcon: (props: any): any => ({
      color: starMap[props.starred],
      cursor: props.editMode ? 'pointer' : 'default',
    }),
  });
});

interface StarredIconProps {
  onClick: () => void;
  starred: Starred;
  editMode: boolean;
}

const StarredIcon: React.FC<StarredIconProps> = ({
  onClick,
  starred,
  editMode,
}) => {
  const classes = useStyles({ starred, editMode });

  return (
    <Tooltip title="Starred">
      <StarIcon
        onClick={!editMode ? undefined : onClick}
        fontSize="small"
        className={starred === 'none' ? 'hiddenIcon' : classes.visibileIcon}
      />
    </Tooltip>
  );
};

export default StarredIcon;
