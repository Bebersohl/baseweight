import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AutoComplete from './AutoComplete';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  currencyCharacter: {
    color: theme.palette.grey[500],
  },
  currencyWrapper: {
    display: 'flex',
    alignItems: 'baseline',
  },
  input: (props: any): any => ({
    padding: 0,
    border: 'none',
    borderBottom: `2px solid transparent`,
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
    ...theme.typography[props.textVariant],
    outline: 'none',
    boxSizing: 'border-box',
    '&:hover, &:focus': {
      borderBottom: `2px solid ${theme.palette.type === 'light' ? theme.palette.grey[400] : theme.palette.grey[700]}`,
    },
    width: '100%',
  }),
}));

interface EditableCellProps {
  type?: 'text' | 'price' | 'weight';
  currencyCharacter?: string;
  editMode: boolean;
  children: any;
  value: string;
  onBlur: (event: any) => void;
  placeholder: string;
  autoComplete?: boolean;
  gearId?: string;
  catId?: string;
  textVariant?: string;
  lastAddedId?: string;
  inputRef?: any;
  listId?: string;
  weightRef?: any;
  priceRef?: any;
}

const EditableCell: React.FC<EditableCellProps> = ({
  type = 'text',
  currencyCharacter = '$',
  editMode,
  children,
  placeholder,
  value,
  onBlur,
  autoComplete = false,
  gearId,
  catId,
  textVariant = 'body1',
  lastAddedId,
  inputRef,
  listId,
  weightRef,
  priceRef,
}) => {
  const classes = useStyles({ textVariant });

  if (!editMode) {
    return children;
  }

  if (autoComplete) {
    return (
      <AutoComplete
        listId={listId}
        catId={catId}
        value={value}
        onBlur={onBlur}
        gearId={gearId}
        inputStyles={classes.input}
        lastAddedId={lastAddedId}
        weightRef={weightRef}
        priceRef={priceRef}
      />
    );
  }

  const commonProps = {
    className: classes.input,
    defaultValue: value,
    onBlur: onBlur,
    placeholder: placeholder,
    autoComplete: 'off',
  };

  if (type === 'price') {
    return (
      <span className={classes.currencyWrapper}>
        <Typography component="span" className={classes.currencyCharacter}>
          {currencyCharacter}
        </Typography>
        <input ref={inputRef} type="number" {...commonProps} />
      </span>
    );
  }

  if (type === 'weight') {
    return (
      <input
        ref={inputRef}
        type="number"
        style={{ textAlign: 'right' }}
        {...commonProps}
      />
    );
  }

  return (
    <input
      {...commonProps}
      autoFocus={lastAddedId === catId && placeholder === 'Category'}
    />
  );
};

export default React.memo(EditableCell);
