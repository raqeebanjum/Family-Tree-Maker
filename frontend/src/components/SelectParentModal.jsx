import {
    Modal,
    Box,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
  } from '@mui/material';
  
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: '80vh',
    overflow: 'auto',
  };
  
  function SelectParentModal({ open, onClose, members, onSelect, type = '', childName = '' }) {
    // Add default values to prevent the charAt error
    
    // Filter members by gender and exclude those who would create circular relationships
    const eligibleParents = members.filter(member => 
      member.gender === (type === 'father' ? 'male' : 'female')
    );
  
    const parentType = type ? type.charAt(0).toUpperCase() + type.slice(1) : '';
  
    return (
      <Modal 
        open={open} 
        onClose={onClose}
        aria-labelledby="select-parent-modal"
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            {parentType && childName 
              ? `Select ${parentType} for ${childName}`
              : 'Select Parent'}
          </Typography>
          
          {eligibleParents.length === 0 ? (
            <Typography>
              {type ? `No eligible ${type}s available` : 'No eligible parents available'}
            </Typography>
          ) : (
            <List>
              {eligibleParents.map((member) => (
                <ListItem 
                  button 
                  key={member._id}
                  onClick={() => onSelect(member._id)}
                  sx={{ 
                    border: '1px solid #eee', 
                    mb: 1, 
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  <ListItemText 
                    primary={member.name}
                    secondary={`Born: ${new Date(member.birthDate).toLocaleDateString()}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
          
          <Button 
            variant="outlined" 
            onClick={onClose}
            sx={{ mt: 2 }}
            fullWidth
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    );
  }
  
  export default SelectParentModal;