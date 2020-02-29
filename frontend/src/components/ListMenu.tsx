import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';

interface ListMenuProps {
  handleCopyList: () => void;
  handleDeleteList: () => void;
  isListOwner: boolean;
  handleExportList: () => void;
  isMobile: boolean;
}

const ListMenu: React.FC<ListMenuProps> = ({
  isMobile,
  handleCopyList,
  handleDeleteList,
  isListOwner,
  handleExportList,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let menuItems = [
    <MenuItem key="copy" onClick={handleCopyList}>
      Copy List
    </MenuItem>,
    <MenuItem key="print" onClick={() => window.print()}>
      Print List
    </MenuItem>,
    <MenuItem key="export" onClick={handleExportList}>
      Export CSV
    </MenuItem>,
  ];

  if (isListOwner) {
    menuItems = [
      ...menuItems,
      <MenuItem key="import" onClick={handleClose}>
        <label htmlFor="file-upload-button" style={{ cursor: 'pointer' }}>
          Import CSV
        </label>
      </MenuItem>,
      <MenuItem key="delete" onClick={handleDeleteList}>
        Delete List
      </MenuItem>,
    ];
  }

  return (
    <>
      <IconButton color="secondary" onClick={handleClick}>
        <MoreVertIcon fontSize={isMobile ? 'large' : 'default'} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuItems}
      </Menu>
    </>
  );
};

export default ListMenu;
