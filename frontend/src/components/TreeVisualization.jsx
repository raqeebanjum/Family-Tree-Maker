import { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Menu, MenuItem, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import SelectParentModal from './SelectParentModal';

const CustomNode = ({ data }) => {
    return (
      <div
        style={{
          padding: '20px',
          background: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          position: 'relative',
          width: '200px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          data.onAddClick(e);
        }}
      >
        {/* Profile Picture Circle */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#f0f0f0',
            margin: '0 auto 8px auto',
          }}
        />
  
        {/* Name */}
        <div style={{ 
          textAlign: 'center',
          fontWeight: 500,
          marginBottom: '4px'
        }}>
          {data.name}
        </div>
  
        {/* Birth Date */}
        <div style={{ 
          textAlign: 'center',
          fontSize: '12px',
          color: '#666'
        }}>
          {data.birthDate && `Born: ${new Date(data.birthDate).toLocaleDateString()}`}
        </div>
  
        {/* Gender */}
        <div style={{ 
          textAlign: 'center',
          fontSize: '12px',
          color: data.gender === 'male' ? 'blue' : 'pink'
        }}>
          {data.gender}
        </div>
  
        <Handle 
          type="target" 
          position={Position.Top} 
          style={{ visibility: 'hidden' }}
        />
        <Handle 
          type="source" 
          position={Position.Bottom} 
          style={{ visibility: 'hidden' }}
        />
      </div>
    );
  };

function TreeVisualization({ members, onAddParent, onEditMember, onAddImage, onAddDocument }) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    
    const [settingsMenu, setSettingsMenu] = useState({
      open: false,
      position: { x: 0, y: 0 },
      nodeId: null
    });
  
    const [parentSelection, setParentSelection] = useState({
      open: false,
      type: null,
      childId: null,
      childName: ''
    });
  
    const handleSettingsClick = (event, nodeId) => {
      event.stopPropagation();
      setSettingsMenu({
        open: true,
        position: { x: event.clientX, y: event.clientY },
        nodeId
      });
    };
  
    const createNodesAndEdges = useCallback((members) => {
      if (!members || members.length === 0) return;
  
      // Create a map of nodes by their IDs for easier reference
      const nodeMap = new Map();
      members.forEach(member => nodeMap.set(member._id, member));
  
      // Calculate levels (generations)
      const nodeLevels = new Map();
      const calculateLevel = (memberId, level = 0) => {
        if (nodeLevels.has(memberId)) return;
        nodeLevels.set(memberId, level);
        const member = nodeMap.get(memberId);
        if (member.fatherId) calculateLevel(member.fatherId, level - 1);
        if (member.motherId) calculateLevel(member.motherId, level - 1);
        member.childrenIds?.forEach(childId => calculateLevel(childId, level + 1));
      };
  
      // Start with members who have no children
      members.forEach(member => {
        if (!members.some(m => m.fatherId === member._id || m.motherId === member._id)) {
          calculateLevel(member._id);
        }
      });
  
      // Create nodes with positions based on levels
      const levelGroups = new Map(); // Group nodes by level
      nodeLevels.forEach((level, id) => {
        if (!levelGroups.has(level)) levelGroups.set(level, []);
        levelGroups.get(level).push(id);
      });
  
      const newNodes = [];
      levelGroups.forEach((memberIds, level) => {
        memberIds.forEach((id, index) => {
          const member = nodeMap.get(id);
          newNodes.push({
            id: member._id,
            position: { 
              x: index * 300, 
              y: level * 200 
            },
            type: 'custom',
            data: {
              ...member,
              onAddClick: (e) => handleSettingsClick(e, member._id),
              onImageClick: () => onAddImage?.(member._id),
              onDocumentClick: () => onAddDocument?.(member._id),
            }
          });
        });
      });
  
      // Create edges
      const newEdges = [];
      members.forEach(member => {
        if (member.fatherId) {
          newEdges.push({
            id: `${member.fatherId}-${member._id}`,
            source: member.fatherId,
            target: member._id,
            type: 'smoothstep',
            style: { stroke: '#e0e0e0', strokeWidth: 2 }
          });
        }
        if (member.motherId) {
          newEdges.push({
            id: `${member.motherId}-${member._id}`,
            source: member.motherId,
            target: member._id,
            type: 'smoothstep',
            style: { stroke: '#e0e0e0', strokeWidth: 2 }
          });
        }
      });
  
      setNodes(newNodes);
      setEdges(newEdges);
    }, [setNodes, setEdges, onAddImage, onAddDocument]);
  
    const nodeTypes = {
      custom: CustomNode
    };
  
    useEffect(() => {
      if (members.length > 0) {
        createNodesAndEdges(members);
      }
    }, [members, createNodesAndEdges]);
  
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.1}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
        >
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
        
        <Menu
            open={settingsMenu.open}
            onClose={() => setSettingsMenu({ ...settingsMenu, open: false })}
            anchorReference="anchorPosition"
            anchorPosition={settingsMenu.position}
            >
            <MenuItem onClick={() => {
                setParentSelection({ open: true, type: 'father', childId: settingsMenu.nodeId });
                setSettingsMenu({ ...settingsMenu, open: false });
            }}>Add Father</MenuItem>
            <MenuItem onClick={() => {
                setParentSelection({ open: true, type: 'mother', childId: settingsMenu.nodeId });
                setSettingsMenu({ ...settingsMenu, open: false });
            }}>Add Mother</MenuItem>
            <MenuItem onClick={() => {
                onEditMember?.(settingsMenu.nodeId);
                setSettingsMenu({ ...settingsMenu, open: false });
            }}>Edit Details</MenuItem>
            <MenuItem onClick={() => {
                onAddImage?.(settingsMenu.nodeId);
                setSettingsMenu({ ...settingsMenu, open: false });
            }}>Add Photo</MenuItem>
            <MenuItem onClick={() => {
                onAddDocument?.(settingsMenu.nodeId);
                setSettingsMenu({ ...settingsMenu, open: false });
            }}>Add Document</MenuItem>
        </Menu>
  
        <SelectParentModal
          open={parentSelection.open}
          onClose={() => setParentSelection({ ...parentSelection, open: false })}
          members={members}
          onSelect={(parentId) => {
            onAddParent(parentSelection.childId, parentSelection.type, parentId);
            setParentSelection({ ...parentSelection, open: false });
          }}
          type={parentSelection.type}
          childName={members.find(m => m._id === parentSelection.childId)?.name || ''}
        />
      </div>
    );
  }
  
  export default TreeVisualization;
