import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Unit, UnitType } from '../types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme: Theme) => ({
  unitSelect: {
    color: theme.palette.grey[500],
    '& .MuiSvgIcon-root': {
      color: theme.palette.grey[700],
    },
  },
}));

interface UnitSelectProps {
  value: Unit;
  unitType: UnitType;
  onChange: (e: any) => void;
}

const UnitSelect: React.FC<UnitSelectProps> = ({
  value,
  unitType,
  onChange,
}) => {
  const classes = useStyles({});

  function renderMenuItems() {
    if (unitType === 'imperial') {
      return [
        <MenuItem key="oz" dense value="oz">
          oz
        </MenuItem>,
        <MenuItem key="lb" dense value="lb">
          lb
        </MenuItem>,
      ];
    }

    return [
      <MenuItem key="g" dense value="g">
        g
      </MenuItem>,
      <MenuItem key="kg" dense value="kg">
        kg
      </MenuItem>,
    ];
  }

  return (
    <Select className={classes.unitSelect} onChange={onChange} value={value}>
      {renderMenuItems()}
    </Select>
  );
};

export default React.memo(UnitSelect);
