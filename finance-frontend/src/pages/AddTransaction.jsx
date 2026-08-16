import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddTransaction = () => {
    const [type, setType] = useState('income');
    const [amount, setAmount] = useState('');
    const [categoryOrSource, setCategoryOrSource] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Unauthorized! Please login again.");
                navigate('/');
                return;
            }

            const endpoint = type === 'income' ? 'http://localhost:5000/api/finance/add-income' : 'http://localhost:5000/api/finance/add-expense';
            const payload = type === 'income' 
                ? { source: categoryOrSource, amount: Number(amount), income_date: date, description }
                : { category: categoryOrSource, amount: Number(amount), expense_date: date, description };

            await axios.post(endpoint, payload, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            
            alert(`${type === 'income' ? 'Income' : 'Expense'} added successfully!`);
            navigate('/dashboard');
        } catch (error) {
            console.error("Error adding transaction:", error);
            alert(error.response?.data?.message || "Failed to add transaction.");
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', fontFamily: 'Segoe UI, sans-serif', color: '#1e293b' }}>
            <h2 style={{ marginTop: 0, fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '20px', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' }}>➕ Add New Transaction</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '6px' }}>TRANSACTION TYPE</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', backgroundColor: '#f8fafc', color: '#1e293b', boxSizing: 'border-box' }}>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>

                <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '6px' }}>{type === 'income' ? 'SOURCE (e.g. Salary, Client)' : 'CATEGORY (e.g. Rent, Food)'}</label>
                    <input type="text" value={categoryOrSource} onChange={(e) => setCategoryOrSource(e.target.value)} required placeholder={type === 'income' ? 'Enter source name' : 'Enter category name'} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>

                <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '6px' }}>AMOUNT (₹)</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="Enter amount" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>

                <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '6px' }}>DATE</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>

                <div>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '6px' }}>DESCRIPTION (Optional)</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add any notes..." style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', minHeight: '80px' }} />
                </div>

                <button type="submit" style={{ padding: '14px', backgroundColor: '#059669', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(5,150,105,0.2)' }}>
                    Save Transaction
                </button>
            </form>
        </div>
    );
};

export default AddTransaction;