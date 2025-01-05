import { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel 
} from '@mui/material';
import axios from 'axios';

function FamilyMemberForm({ onMemberAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    deathDate: ''
  });
  
  const [members, setMembers] = useState([]);
  const [selectedParents, setSelectedParents] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/family-members');
        setMembers(response.data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };
    fetchMembers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const memberData = {
        ...formData,
        parentIds: selectedParents
      };
      
      const response = await axios.post('http://localhost:3000/api/family-members', memberData);
      
      // Reset form
      setFormData({ name: '', birthDate: '', deathDate: '' });
      setSelectedParents([]);
      
      if (onMemberAdded) {
        onMemberAdded(response.data);
      }
    } catch (error) {
      console.error('Error adding family member:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: '0 auto' }}>
      <Typography variant="h6" gutterBottom>
        Add Family Member
      </Typography>
      
      <TextField
        fullWidth
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        margin="normal"
        required
      />
      
      <TextField
        fullWidth
        label="Birth Date"
        name="birthDate"
        type="date"
        value={formData.birthDate}
        onChange={handleChange}
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      
      <TextField
        fullWidth
        label="Death Date"
        name="deathDate"
        type="date"
        value={formData.deathDate}
        onChange={handleChange}
        margin="normal"
        InputLabelProps={{ shrink: true }}
      />
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Parents</InputLabel>
        <Select
          multiple
          value={selectedParents}
          onChange={(e) => setSelectedParents(e.target.value)}
          label="Parents"
        >
          {members.map((member) => (
            <MenuItem key={member._id} value={member._id}>
              {member.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Button 
        variant="contained" 
        type="submit" 
        sx={{ mt: 2 }}
        fullWidth
      >
        Add Member
      </Button>
    </Box>
  );
}

export default FamilyMemberForm;