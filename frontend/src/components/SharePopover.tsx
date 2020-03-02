import React, { useRef } from 'react';
import Popover from '@material-ui/core/Popover';
import ShareIcon from '@material-ui/icons/Share';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

interface SharePopoverProps {
  isMobile: boolean;
  listId: string;
}

const SharePopover: React.FC<SharePopoverProps> = ({ isMobile, listId }) => {
  const shareInput = useRef<HTMLInputElement>();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Tooltip title="Share">
        <IconButton color="secondary" onClick={handleClick}>
          <ShareIcon fontSize={isMobile ? 'large' : 'default'} />
        </IconButton>
      </Tooltip>
      <Popover
        onEntering={() =>
          shareInput && shareInput.current && shareInput.current.select()
        }
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <TextField
          style={{ width: 300 }}
          inputRef={shareInput}
          defaultValue={window.location.origin + '/list/' + listId}
          InputProps={{
            readOnly: true,
          }}
          autoFocus
          variant="outlined"
        />
      </Popover>
    </div>
  );
};

export default React.memo(SharePopover);
