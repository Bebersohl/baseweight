import React, { useState } from 'react';
import Modal from './Modal';
import { GearItem } from '../types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import isUrl from 'is-url';
import { actions } from '../reducers';
import { useDispatch } from 'react-redux';

interface AddHyperlinkModalProps {
  hyperlinkItem: { gearItem: GearItem; catId: string } | null;
  onAddHyperlinkModalClose: () => void;
  listId: string;
}

const AddHyperlinkModal: React.FC<AddHyperlinkModalProps> = ({
  hyperlinkItem,
  onAddHyperlinkModalClose,
  listId,
}) => {
  const [hyperlinkText, setHyperlinkText] = useState();

  const dispatch = useDispatch();

  const hyperlinkInput = React.useRef<HTMLInputElement>();

  const submitHyperlink = e => {
    e.preventDefault();
    e.stopPropagation();

    const newLink = hyperlinkText ? hyperlinkText : '';

    if (!isUrl(newLink) && newLink !== '') return;

    if (!hyperlinkItem?.gearItem?.id) return;

    dispatch(
      actions.setHyperlink({
        listId,
        catId: hyperlinkItem.catId,
        hyperlink: newLink,
        gearId: hyperlinkItem.gearItem.id,
      })
    );

    onAddHyperlinkModalClose();
  };

  const isValidLink = isUrl(hyperlinkText) || hyperlinkText === '';

  return (
    <Modal
      isModalOpen={!!hyperlinkItem}
      onModalClose={onAddHyperlinkModalClose}
      onEnter={() => {
        setHyperlinkText(hyperlinkItem?.gearItem.hyperlink || '');
        hyperlinkInput?.current?.select();
      }}
      onSubmit={submitHyperlink}
      actions={
        <Button
          onClick={submitHyperlink}
          disabled={!isValidLink}
          variant="contained"
          color="primary"
          type="submit"
        >
          Submit
        </Button>
      }
    >
      <TextField
        style={{ minWidth: 275 }}
        error={!isValidLink}
        inputProps={{ ref: hyperlinkInput }}
        autoFocus
        onChange={e => {
          setHyperlinkText(e.target.value);
        }}
        label={
          isValidLink ? `${hyperlinkItem?.gearItem.name} link` : 'Invalid URL'
        }
        defaultValue={hyperlinkItem?.gearItem.hyperlink || ''}
      />
    </Modal>
  );
};

export default React.memo(AddHyperlinkModal);
