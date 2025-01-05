import { useEffect, useState } from 'react';
import { Box, Typography, Tab, Tabs } from '@mui/material';
import axios from 'axios';
import TreeVisualization from './TreeVisualization';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ padding: '20px 0' }}>
      {value === index && children}
    </div>
  );
}

function FamilyTree() {
  const [members, setMembers] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/family-members');
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching family members:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Family Tree
      </Typography>
      
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Tree View" />
        <Tab label="List View" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <TreeVisualization members={members} />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {members.map((member) => (
            <Box 
              key={member._id}
              sx={{ 
                p: 2, 
                border: '1px solid #ccc', 
                borderRadius: 1 
              }}
            >
              <Typography variant="subtitle1">{member.name}</Typography>
              {member.birthDate && (
                <Typography variant="body2">
                  Birth Date: {new Date(member.birthDate).toLocaleDateString()}
                </Typography>
              )}
              {member.deathDate && (
                <Typography variant="body2">
                  Death Date: {new Date(member.deathDate).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </TabPanel>
    </Box>
  );
}

export default FamilyTree;