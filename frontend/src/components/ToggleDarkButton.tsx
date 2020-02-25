import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import { IconButton } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginRight: 15,
  }
}));

interface ToggleDarkButtonProps {
  onPaletteTypeChange: () => void;
  paletteType: 'light' | 'dark';
}

const ToggleDarkButton: React.FC<ToggleDarkButtonProps> = ({
  onPaletteTypeChange,
  paletteType,
}) => {
  const classes = useStyles();

  const tooltipText = paletteType === 'dark' ? "Dark mode" : "Light mode";

  return (
    <Tooltip title={tooltipText} className={classes.root}>
      <IconButton size="small" color="inherit" onClick={onPaletteTypeChange}>
        {paletteType === 'dark' ? (<Brightness4Icon />) : (<Brightness7Icon />)}
      </IconButton>
    </Tooltip>
  );
};

export default ToggleDarkButton;
