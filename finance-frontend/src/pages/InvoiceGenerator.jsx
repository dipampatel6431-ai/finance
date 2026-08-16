import { useEffect, useState } from 'react';
import axios from 'axios';

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [clientName, setClientName] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/finance/get-invoices', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInvoices(res.data);
        } catch (error) {
            console.error("Error fetching invoices:", error);
        }
    };

    const handleCreateInvoice = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/finance/create-invoice', {
                client_name: clientName,
                total_amount: Number(totalAmount),
                due_date: dueDate
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Invoice created successfully!");
            setClientName('');
            setTotalAmount('');
            setDueDate('');
            fetchInvoices();
        } catch (error) {
            console.error("Error creating invoice:", error);
            alert("Failed to create invoice.");
        }
    };

    const handleDeleteInvoice = async (id) => {
        if(window.confirm("Are you sure you want to delete this invoice?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/finance/delete-invoice/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchInvoices();
            } catch (error) {
                console.error("Error deleting invoice:", error);
            }
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '30px', fontFamily: 'Segoe UI, sans-serif', color: '#1e293b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>Client Invoices</h1>
                    <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>Manage and generate client billings</p>
                </div>
            </div>

            {/* Create Invoice Form */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '24px', borderRadius: '16px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0, fontSize: '18px', color: '#1e293b', marginBottom: '15px' }}>Create New Invoice</h3>
                <form onSubmit={handleCreateInvoice} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', alignItems: 'end' }}>
                    <div>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '5px' }}>CLIENT NAME</label>
                        <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} required placeholder="Client name" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '5px' }}>AMOUNT (₹)</label>
                        <input type="number" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} required placeholder="Amount" style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '5px' }}>DUE DATE</label>
                        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} />
                    </div>
                    <button type="submit" style={{ padding: '11px', backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Generate Invoice
                    </button>
                </form>
            </div>

            {/* Invoices List */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0, fontSize: '18px', color: '#1e293b', marginBottom: '15px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>All Generated Invoices</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {invoices.length === 0 ? <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No invoices created yet.</p> : 
                        invoices.map((inv, i) => (
                            <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', marginBottom: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <div>
                                    <strong style={{ fontSize: '16px', color: '#0f172a' }}>{inv.client_name}</strong>
                                    <span style={{ display: 'block', color: '#64748b', fontSize: '12px', marginTop: '2px' }}>Due Date: {new Date(inv.due_date).toLocaleDateString()}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <span style={{ color: '#4f46e5', fontWeight: 'bold', fontSize: '16px' }}>₹{inv.total_amount}</span>
                                    <button onClick={() => handleDeleteInvoice(inv._id)} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>🗑️ Delete</button>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
};

Invoices; // keeping export correct
export default Invoices;