import { useEffect, useState } from 'react';
import { getIncomes, getExpenses, deleteIncome, deleteExpense, editIncome, editExpense } from '../api';
import * as XLSX from 'xlsx';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ id: '', type: '', title: '', amount: '', date: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const incomeRes = await getIncomes();
                const expenseRes = await getExpenses();
                
                setIncomes(incomeRes.data);
                setExpenses(expenseRes.data);

                setTotalIncome(incomeRes.data.reduce((acc, curr) => acc + curr.amount, 0));
                setTotalExpense(expenseRes.data.reduce((acc, curr) => acc + curr.amount, 0));
            } catch (error) { console.error("Data fetch error: ", error); }
        };
        fetchData();
    }, []);

    const netBalance = totalIncome - totalExpense;

    const exportToExcel = () => {
        const incomeData = incomes.map(inc => ({ Type: 'Income', Date: new Date(inc.income_date).toLocaleDateString(), Source: inc.source, Amount: inc.amount }));
        const expenseData = expenses.map(exp => ({ Type: 'Expense', Date: new Date(exp.expense_date).toLocaleDateString(), Category: exp.category, Amount: exp.amount }));
        const combinedData = [...incomeData, ...expenseData].sort((a, b) => new Date(a.Date) - new Date(b.Date));
        const worksheet = XLSX.utils.json_to_sheet(combinedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Financial Report");
        XLSX.writeFile(workbook, "Finance_Report.xlsx");
    };

    const handleDeleteIncome = async (id) => {
        if(window.confirm("Delete this income entry?")) {
            await deleteIncome(id);
            window.location.reload(); 
        }
    };
    const handleDeleteExpense = async (id) => {
        if(window.confirm("Delete this expense entry?")) {
            await deleteExpense(id);
            window.location.reload();
        }
    };

    const openEditModal = (item, type) => {
        setEditData({
            id: item._id,
            type: type,
            title: type === 'income' ? item.source : item.category,
            amount: item.amount,
            date: type === 'income' ? item.income_date.split('T')[0] : item.expense_date.split('T')[0]
        });
        setIsEditing(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editData.type === 'income') {
                await editIncome(editData.id, { source: editData.title, amount: Number(editData.amount), income_date: editData.date });
            } else {
                await editExpense(editData.id, { category: editData.title, amount: Number(editData.amount), expense_date: editData.date });
            }
            setIsEditing(false);
            window.location.reload();
        } catch (error) {
            console.error("Edit failed:", error);
            alert("Update failed!");
        }
    };

    const barData = [{ name: 'Income', Amount: totalIncome, fill: '#059669' }, { name: 'Expense', Amount: totalExpense, fill: '#dc2626' }];
    const expenseByCategory = expenses.reduce((acc, curr) => { acc[curr.category] = (acc[curr.category] || 0) + curr.amount; return acc; }, {});
    const pieData = Object.keys(expenseByCategory).map(key => ({ name: key, value: expenseByCategory[key] }));
    const COLORS = ['#4f46e5', '#059669', '#d97706', '#dc2626', '#7c3aed', '#db2777'];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b' }}>
            {/* EDIT MODAL */}
            {isEditing && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '16px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ marginTop: 0, color: '#0f172a', fontSize: '20px' }}>Edit {editData.type === 'income' ? 'Income' : 'Expense'}</h2>
                        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '5px' }}>TITLE</label>
                                <input type="text" value={editData.title} onChange={(e) => setEditData({...editData, title: e.target.value})} required style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '5px' }}>AMOUNT</label>
                                <input type="number" value={editData.amount} onChange={(e) => setEditData({...editData, amount: e.target.value})} required style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '5px' }}>DATE</label>
                                <input type="date" value={editData.date} onChange={(e) => setEditData({...editData, date: e.target.value})} required style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Update</button>
                                <button type="button" onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '12px', backgroundColor: '#cbd5e1', color: '#1e293b', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>Financial Dashboard</h1>
                    <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>Aeron Digital Enterprise System</p>
                </div>
                <button onClick={exportToExcel} style={{ backgroundColor: '#059669', color: '#ffffff', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(5,150,105,0.2)' }}>
                    📊 Export Report
                </button>
            </div>
            
            {/* METRICS CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #059669', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 'bold', color: '#059669', textTransform: 'uppercase' }}>Total Income</p>
                    <h2 style={{ margin: 0, fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>₹{totalIncome.toFixed(2)}</h2>
                </div>
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #dc2626', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 'bold', color: '#dc2626', textTransform: 'uppercase' }}>Total Expense</p>
                    <h2 style={{ margin: 0, fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>₹{totalExpense.toFixed(2)}</h2>
                </div>
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '5px solid #4f46e5', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 'bold', color: '#4f46e5', textTransform: 'uppercase' }}>Net Balance</p>
                    <h2 style={{ margin: 0, fontSize: '32px', fontWeight: '800', color: '#0f172a' }}>₹{netBalance.toFixed(2)}</h2>
                </div>
            </div>

            {/* CHARTS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '16px', color: '#1e293b' }}>Income vs Expense</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={barData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="Amount" /></BarChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '16px', color: '#1e293b' }}>Expense Breakdown</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip /><Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* TRANSACTION TABLES */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px' }}>
                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginTop: 0, paddingBottom: '12px', borderBottom: '2px solid #e2e8f0', color: '#059669', fontSize: '18px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Recent Incomes</span>
                        <span style={{ fontSize: '12px', backgroundColor: '#d1fae5', color: '#065f46', padding: '4px 10px', borderRadius: '20px' }}>{incomes.length} Entries</span>
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '300px', overflowY: 'auto' }}>
                        {incomes.length === 0 ? <p style={{ color: '#94a3b8', textAlign: 'center' }}>No records found.</p> : 
                            incomes.map((inc, i) => (
                                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', marginBottom: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <div>
                                        <strong style={{ fontSize: '14px', color: '#0f172a' }}>{inc.source}</strong>
                                        <span style={{ display: 'block', color: '#64748b', fontSize: '12px' }}>{new Date(inc.income_date).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ color: '#059669', fontWeight: 'bold', fontSize: '15px' }}>+₹{inc.amount}</span>
                                        <button onClick={() => openEditModal(inc, 'income')} style={{ backgroundColor: '#d97706', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}>✏️</button>
                                        <button onClick={() => handleDeleteIncome(inc._id)} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}>🗑️</button>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>

                <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginTop: 0, paddingBottom: '12px', borderBottom: '2px solid #e2e8f0', color: '#dc2626', fontSize: '18px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Recent Expenses</span>
                        <span style={{ fontSize: '12px', backgroundColor: '#fee2e2', color: '#991b1b', padding: '4px 10px', borderRadius: '20px' }}>{expenses.length} Entries</span>
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '300px', overflowY: 'auto' }}>
                        {expenses.length === 0 ? <p style={{ color: '#94a3b8', textAlign: 'center' }}>No records found.</p> : 
                            expenses.map((exp, i) => (
                                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', marginBottom: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <div>
                                        <strong style={{ fontSize: '14px', color: '#0f172a' }}>{exp.category}</strong>
                                        <span style={{ display: 'block', color: '#64748b', fontSize: '12px' }}>{new Date(exp.expense_date).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '15px' }}>-₹{exp.amount}</span>
                                        <button onClick={() => openEditModal(exp, 'expense')} style={{ backgroundColor: '#d97706', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}>✏️</button>
                                        <button onClick={() => handleDeleteExpense(exp._id)} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer' }}>🗑️</button>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;