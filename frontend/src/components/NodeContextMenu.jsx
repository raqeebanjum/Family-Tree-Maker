// src/components/NodeContextMenu.jsx
import { Menu, MenuItem } from '@mui/material';

function NodeContextMenu({ 
  anchorPosition, 
  open, 
  onClose, 
  onAddFather, 
  onAddMother 
}) {
  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
    >
      <MenuItem onClick={onAddFather}>Add Father</MenuItem>
      <MenuItem onClick={onAddMother}>Add Mother</MenuItem>
    </Menu>
  );
}

export default NodeContextMenu;