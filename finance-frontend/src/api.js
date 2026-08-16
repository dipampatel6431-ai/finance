import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Request Interceptor: Har API call ke sath Token attach karega
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// =======================
// AUTH APIs
// =======================
export const signup = (formData) => API.post('/auth/signup', formData);
export const login = (formData) => API.post('/auth/login', formData);

// =======================
// FINANCE APIs
// =======================

// Incomes
export const getIncomes = () => API.get('/finance/get-incomes');
export const addIncome = (data) => API.post('/finance/add-income', data);

// Expenses
export const getExpenses = () => API.get('/finance/get-expenses');
export const addExpense = (data) => API.post('/finance/add-expense', data);

// Invoices
export const getInvoices = () => API.get('/finance/get-invoices');
export const createInvoice = (data) => API.post('/finance/create-invoice', data);

// Delete APIs
export const deleteIncome = (id) => API.delete(`/finance/delete-income/${id}`);
export const deleteExpense = (id) => API.delete(`/finance/delete-expense/${id}`);
export const deleteInvoice = (id) => API.delete(`/finance/delete-invoice/${id}`);

// Edit APIs
export const editIncome = (id, data) => API.put(`/finance/edit-income/${id}`, data);
export const editExpense = (id, data) => API.put(`/finance/edit-expense/${id}`, data);

export default API;