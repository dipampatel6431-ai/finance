const express = require('express');
const router = express.Router();

const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Invoice = require('../models/Invoice');
const authMiddleware = require('../middleware/authMiddleware');

// ==========================================
// INCOME APIs (User Specific)
// ==========================================
router.post('/add-income', authMiddleware, async (req, res) => {
    try {
        const { source, amount, income_date, description } = req.body;
        
        if (!source || !amount || !income_date) {
            return res.status(400).json({ message: "Please provide source, amount, and income_date" });
        }

        const newIncome = new Income({
            user: req.user.id,
            source,
            amount: Number(amount),
            income_date,
            description
        });

        await newIncome.save();
        res.status(201).json({ message: "Income added successfully!", data: newIncome });
    } catch (error) {
        console.error("Income Add Error:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

router.get('/get-incomes', authMiddleware, async (req, res) => {
    try {
        const incomes = await Income.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ==========================================
// EXPENSE APIs (User Specific)
// ==========================================
router.post('/add-expense', authMiddleware, async (req, res) => {
    try {
        const { category, amount, expense_date, description } = req.body;
        
        if (!category || !amount || !expense_date) {
            return res.status(400).json({ message: "Please provide category, amount, and expense_date" });
        }

        const newExpense = new Expense({
            user: req.user.id,
            category,
            amount: Number(amount),
            expense_date,
            description
        });

        await newExpense.save();
        res.status(201).json({ message: "Expense added successfully!", data: newExpense });
    } catch (error) {
        console.error("Expense Add Error:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

router.get('/get-expenses', authMiddleware, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ==========================================
// INVOICE APIs (User Specific)
// ==========================================
router.post('/create-invoice', authMiddleware, async (req, res) => {
    try {
        const { client_name, total_amount, due_date } = req.body;
        
        if (!client_name || !total_amount || !due_date) {
            return res.status(400).json({ message: "Please provide all invoice fields" });
        }

        const newInvoice = new Invoice({ 
            user: req.user.id, 
            client_name, 
            total_amount: Number(total_amount), 
            due_date 
        });
        await newInvoice.save();
        res.status(201).json({ message: "Invoice created successfully!", data: newInvoice });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

router.get('/get-invoices', authMiddleware, async (req, res) => {
    try {
        const invoices = await Invoice.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ==========================================
// EDIT APIs (User Verified)
// ==========================================
router.put('/edit-income/:id', authMiddleware, async (req, res) => {
    try {
        const updatedIncome = await Income.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id }, 
            req.body, 
            { new: true }
        );
        if (!updatedIncome) return res.status(404).json({ message: "Income not found or unauthorized" });
        res.status(200).json({ message: "Income updated successfully!", data: updatedIncome });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

router.put('/edit-expense/:id', authMiddleware, async (req, res) => {
    try {
        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id }, 
            req.body, 
            { new: true }
        );
        if (!updatedExpense) return res.status(404).json({ message: "Expense not found or unauthorized" });
        res.status(200).json({ message: "Expense updated successfully!", data: updatedExpense });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ==========================================
// DELETE APIs (User Verified)
// ==========================================
router.delete('/delete-income/:id', authMiddleware, async (req, res) => {
    try {
        const deleted = await Income.findOneAndDelete({ _id: req.params.id, user: req.user.id }); 
        if (!deleted) return res.status(404).json({ message: "Income not found" });
        res.status(200).json({ message: "Income deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

router.delete('/delete-expense/:id', authMiddleware, async (req, res) => {
    try {
        const deleted = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id }); 
        if (!deleted) return res.status(404).json({ message: "Expense not found" });
        res.status(200).json({ message: "Expense deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

router.delete('/delete-invoice/:id', authMiddleware, async (req, res) => {
    try {
        const deleted = await Invoice.findOneAndDelete({ _id: req.params.id, user: req.user.id }); 
        if (!deleted) return res.status(404).json({ message: "Invoice not found" });
        res.status(200).json({ message: "Invoice deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;