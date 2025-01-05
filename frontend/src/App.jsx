import { useState, useEffect } from 'react';
import { Box, Fab } from '@mui/material';
import axios from 'axios';
import TreeVisualization from './components/TreeVisualization';
import AddMemberModal from './components/AddMemberModal';

function App() {
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/family-members');
      setMembers(response.data);
      console.log('Fetched members:', response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleAddMember = async (memberData) => {
    try {
      console.log('Sending data to backend:', memberData);
      const response = await axios.post('http://localhost:3000/api/family-members', memberData);
      console.log('Response from backend:', response.data);
      fetchMembers();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleAddParent = async (childId, parentType, parentId) => {
    try {
      await axios.patch(`http://localhost:3000/api/family-members/${childId}/parent`, {
        parentId,
        parentType
      });
      fetchMembers();
    } catch (error) {
      console.error('Error adding parent:', error);
    }
  };

  const handleEditMember = async (memberId) => {
    // TODO: Implement edit functionality
    console.log('Edit member:', memberId);
  };

  const handleAddImage = async (memberId) => {
    // TODO: Implement image upload
    console.log('Add image for member:', memberId);
  };

  const handleAddDocument = async (memberId) => {
    // TODO: Implement document upload
    console.log('Add document for member:', memberId);
  };

  return (
    <Box sx={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      <TreeVisualization 
        members={members} 
        onAddParent={handleAddParent}
        onEditMember={handleEditMember}
        onAddImage={handleAddImage}
        onAddDocument={handleAddDocument}
      />
      
      <Fab 
        color="primary" 
        aria-label="add" 
        onClick={() => setIsModalOpen(true)}
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
        }}
      >
        +
      </Fab>

      <AddMemberModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddMember}
      />
    </Box>
  );
}

export default App;