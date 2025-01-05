const express = require('express');
const router = express.Router();
const FamilyMember = require('../models/FamilyMember');

// Get all family members
router.get('/', async (req, res) => {
    try {
        const members = await FamilyMember.find();
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new family member
router.post('/', async (req, res) => {
    console.log('Received request body:', req.body);
    
    const member = new FamilyMember({
        name: req.body.name,
        birthDate: req.body.birthDate,
        gender: req.body.gender,  // Add this line
        fatherId: req.body.fatherId || null,
        motherId: req.body.motherId || null
    });

    try {
        console.log('Attempting to save member:', member);
        const newMember = await member.save();
        console.log('Successfully saved member:', newMember);
        res.status(201).json(newMember);
    } catch (error) {
        console.error('Error saving member:', error);
        res.status(400).json({ message: error.message });
    }
});

// Get one family member
router.get('/:id', async (req, res) => {
    try {
        const member = await FamilyMember.findById(req.params.id);
        if (member) {
            res.json(member);
        } else {
            res.status(404).json({ message: 'Member not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update parent
router.patch('/:id/parent', async (req, res) => {
    try {
      const { parentId, parentType } = req.body;
      const updateField = parentType === 'father' ? 'fatherId' : 'motherId';
      
      const updatedMember = await FamilyMember.findByIdAndUpdate(
        req.params.id,
        { [updateField]: parentId },
        { new: true }
      );
      
      res.json(updatedMember);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

module.exports = router;