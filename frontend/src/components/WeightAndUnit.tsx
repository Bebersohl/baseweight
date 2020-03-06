import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { UnitType } from '../types';
import FormatWeight from './FormatWeight';
import { switchUnit, getDefaultUnit, fromGrams } from '../utils';
import UnitButton from './UnitButton';

const useStyles = makeStyles((theme: Theme) => ({
  weight: (props: any) => ({
    flexBasis: 50,
    flexShrink: 0,
    textAlign: 'right',
    display: props.hide ? 'none' : 'block',
  }),
  unit: (props: any) => ({
    flexBasis: 25,
    flexShrink: 0,
    textAlign: 'right',
    display: props.hide ? 'none' : 'block',
  }),
}));

interface WeightAndUnitProps {
  inputWeight: number | string;
  unitType: UnitType;
  bold?: boolean;
}

const WeightAndUnit: React.FC<WeightAndUnitProps> = ({
  inputWeight,
  unitType,
  bold = false,
}) => {
  const classes = useStyles({});

  const defaultUnit = getDefaultUnit(Number(inputWeight), unitType);

  const [unitState, setUnitState] = useState(defaultUnit);

  const weight = fromGrams(inputWeight, unitState);

  const switchUnitState = () => setUnitState(switchUnit(unitState));

  return (
    <>
      <div className={classes.weight}>
        <FormatWeight bold={bold} value={weight} />
      </div>
      <div className={classes.unit}>
        <UnitButton bold={bold} value={unitState} onChange={switchUnitState} />
      </div>
    </>
  );
};

export default React.memo(WeightAndUnit);
