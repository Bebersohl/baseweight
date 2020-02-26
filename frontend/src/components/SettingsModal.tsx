import React from 'react';
import Modal from './Modal';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { actions } from '../reducers';
import { useAppSelector } from '../store';
import { showDescriptionsSelector, showQuantitiesSelector } from '../selectors';

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
  listId: string;
  isListOwner: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isSettingsModalOpen,
  onSettingsModalClose,
  showCheckboxes,
  showPrices,
  currencyCharacter,
  listId,
  isListOwner,
}) => {
  const classes = useStyles({});

  const dispatch = useDispatch();

  const showDescriptions = useAppSelector(state =>
    showDescriptionsSelector(state, listId)
  );

  const showQuantities = useAppSelector(state =>
    showQuantitiesSelector(state, listId)
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
          <ListItemText primary="Show quantities" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              onChange={() =>
                dispatch(actions.toggleShowColumn({ listId, column: 'showQuantities' }))
              }
              checked={showQuantities}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText primary="Show checkboxes" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              onChange={() =>
                dispatch(actions.toggleShowColumn({ listId, column: 'showCheckboxes' }))
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
              onChange={() => dispatch(actions.toggleShowColumn({ listId, column: 'showPrices' }))}
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
                dispatch(actions.toggleShowColumn({ listId, column: 'showDescriptions' }))
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
