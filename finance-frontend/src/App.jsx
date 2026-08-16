import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import InvoiceGenerator from './pages/InvoiceGenerator';
import Auth from './pages/Auth';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/auth" />;
};

function App() {
  const token = localStorage.getItem('token');

  const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
  };

  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif', background: '#f4f6f8', minHeight: '100vh' }}>
        
        {/* Navigation Bar */}
        <nav style={{ padding: '15px 30px', background: '#2c3e50', color: '#ecf0f1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h2 style={{ margin: 0 }}>Finance System</h2>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {/* Saare modules yahan permanently visible rahenge jab user login hoga */}
            <Link to="/" style={{ color: '#ecf0f1', textDecoration: 'none', fontWeight: 'bold' }}>Dashboard</Link>
            <Link to="/add" style={{ color: '#ecf0f1', textDecoration: 'none', fontWeight: 'bold' }}>Add Transaction</Link>
            <Link to="/invoice" style={{ color: '#ecf0f1', textDecoration: 'none', fontWeight: 'bold' }}>Invoices</Link>
            
            {/* Dynamic Login/Logout Button */}
            {!token ? (
                <Link to="/auth" style={{ background: '#27ae60', padding: '8px 15px', borderRadius: '4px', color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
            ) : (
                <button onClick={handleLogout} style={{ background: '#e74c3c', padding: '8px 15px', border: 'none', borderRadius: '4px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Logout</button>
            )}
          </div>
        </nav>

        {/* Route Definitions */}
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/add" element={<PrivateRoute><AddTransaction /></PrivateRoute>} />
            <Route path="/invoice" element={<PrivateRoute><InvoiceGenerator /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        
      </div>
    </Router>
  );
}

export default App;