import React from 'react';
import Modal from './Modal';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { UnitType } from '../types';
import { useDispatch } from 'react-redux';
import { actions } from '../reducers';
import { useAppSelector } from '../store';
import { showDescriptionsSelector } from '../selectors';

const useStyles = makeStyles(theme => ({
  currencyInput: {
    width: 60,
  },
  list: {
    minWidth: 300,
  },
}));

interface SettingsModalProps {
  isSettingsModalOpen: boolean;
  onSettingsModalClose: any;
  showCheckboxes: boolean;
  showPrices: boolean;
  currencyCharacter: string;
  unitType: UnitType;
  listId: string;
  isListOwner: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isSettingsModalOpen,
  onSettingsModalClose,
  showCheckboxes,
  showPrices,
  currencyCharacter,
  unitType,
  listId,
  isListOwner,
}) => {
  const classes = useStyles({});

  const dispatch = useDispatch();

  const showDescriptions = useAppSelector(state =>
    showDescriptionsSelector(state, listId)
  );

  return (
    <Modal
      isModalOpen={isSettingsModalOpen}
      onModalClose={onSettingsModalClose}
    >
      <List className={classes.list}>
        {isListOwner && (
          <>
            <ListItem>
              <ListItemText primary="Currency character" />
              <ListItemSecondaryAction>
                <TextField
                  size="small"
                  className={classes.currencyInput}
                  variant="outlined"
                  inputProps={{ maxLength: 3, onFocus: e => e.target.select() }}
                  defaultValue={currencyCharacter}
                  onBlur={e =>
                    dispatch(
                      actions.setCurrencyCharacter({
                        listId,
                        character: e.target.value,
                      })
                    )
                  }
                  error={
                    currencyCharacter.length === 0 ||
                    currencyCharacter.length > 3
                  }
                />
              </ListItemSecondaryAction>
            </ListItem>
          </>
        )}
        <ListItem>
          <ListItemText primary="Show checkboxes" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              onChange={() =>
                dispatch(actions.toggleShowCheckboxes({ listId }))
              }
              checked={showCheckboxes}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText primary="Show prices" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              onChange={() => dispatch(actions.toggleShowPrices({ listId }))}
              checked={showPrices}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText primary="Show descriptions" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              onChange={() =>
                dispatch(actions.toggleShowDescriptions({ listId }))
              }
              checked={showDescriptions}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </Modal>
  );
};

export default React.memo(SettingsModal);
