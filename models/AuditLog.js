const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action_type: { type: String, required: true }, // e.g., 'CREATED_INVOICE'
    description: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', AuditLogSchema);