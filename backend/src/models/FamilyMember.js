const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    fatherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FamilyMember'
    },
    motherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FamilyMember'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('FamilyMember', familyMemberSchema);