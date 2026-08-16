const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    client_name: { type: String, required: true },
    total_amount: { type: Number, required: true },
    status: { type: String, enum: ['Paid', 'Unpaid', 'Pending'], default: 'Unpaid' },
    due_date: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);