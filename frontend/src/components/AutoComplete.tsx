import React, { useState } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { useAppSelector } from '../store';
import {
  getGearLocker,
  unitTypeSelector,
  gearSuggestionsSelector,
} from '../selectors';
import { actions } from '../reducers';
import { useDispatch } from 'react-redux';
import { GearSuggestion } from '../types';
import { fromGrams, convertUnitToListType, toGrams, toFixed } from '../utils';
import { useTheme } from '@material-ui/core';

interface AutoCompleteProps {
  value: string;
  onBlur: (event: any) => void;
  gearId?: string;
  inputStyles: any;
  lastAddedId?: string;
  listId?: string;
  catId?: string;
  weightRef?: any;
  priceRef?: any;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  value,
  onBlur,
  gearId,
  inputStyles,
  lastAddedId,
  listId,
  catId,
  weightRef,
  priceRef,
}) => {
  const [text, setText] = useState(value);

  const unitType = useAppSelector(state => unitTypeSelector(state, listId));

  const dispatch = useDispatch();

  const gearSuggestions = useAppSelector(gearSuggestionsSelector);

  const gearLocker = useAppSelector(state => {
    return getGearLocker(state, [listId, 'demo']);
  });

  const theme = useTheme();

  return (
    <Autocomplete
      onChange={(e, suggestion) => {
        if (!listId || !catId || !gearId || !suggestion) {
          return;
        }

        const weightInGrams = toGrams(suggestion.weight, suggestion.unit);

        const targetUnit = convertUnitToListType(suggestion.unit, unitType);

        const targetWeight = fromGrams(weightInGrams, targetUnit);

        const formattedTargetWeight = toFixed(targetWeight);

        if (weightRef?.current?.value) {
          weightRef.current.value = formattedTargetWeight;
        }

        if (priceRef?.current?.value) {
          priceRef.current.value = suggestion.price;
        }

        dispatch(
          actions.updateItemWithSuggestion({
            listId,
            catId,
            gearId,
            suggestion,
            weight: formattedTargetWeight,
            unit: targetUnit,
          })
        );
      }}
      freeSolo
      autoSelect={false}
      selectOnFocus={false}
      disableOpenOnFocus
      options={[...gearLocker, ...gearSuggestions]}
      getOptionLabel={gearSuggestion => gearSuggestion.label}
      value={{ label: text } as any}
      onInputChange={(e, value, reason) => {
        setText(value);
      }}
      filterOptions={options => {
        const filteredOptions: GearSuggestion[] = [];

        if (text === '') {
          return filteredOptions;
        }

        for (let option of options) {
          if (
            option.label.toLowerCase().includes(text.toLowerCase()) &&
            option.label !== ''
          ) {
            filteredOptions.push(option);

            if (filteredOptions.length > 10) {
              return filteredOptions;
            }
          }
        }

        return filteredOptions;
      }}
      renderOption={option => {
        const matches = match(option.label, text);
        const parts = parse(option.label, matches);

        return (
          <span>
            {parts.map((part, index) => (
              <span
                key={index}
                style={{
                  color: option.serverSuggestion
                    ? theme.palette.text.secondary
                    : theme.palette.text.primary,
                  backgroundColor: part.highlight
                    ? theme.palette.type === 'light'
                      ? theme.palette.secondary.light
                      : theme.palette.secondary.main
                    : 'transparent',
                }}
              >
                {part.text}
              </span>
            ))}
          </span>
        );
      }}
      renderInput={(params: any) => {
        const { ref } = params.InputProps;
        const {
          className,
          onBlur: onInputBlur,
          ...inputProps
        } = params.inputProps;

        return (
          <div ref={ref}>
            <input
              {...inputProps}
              id={params.id}
              className={inputStyles}
              placeholder="name"
              autoFocus={lastAddedId === gearId}
              onBlur={e => {
                onInputBlur(e);
                onBlur(e);
              }}
              autoComplete="new-password"
            />
          </div>
        );
      }}
    />
  );
};

export default React.memo(AutoComplete);
