const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    source: { type: String, required: true },
    amount: { type: Number, required: true },
    income_date: { type: Date, required: true },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Income', IncomeSchema);