import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true); // Toggle between Login & Signup
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/signup';
            const payload = isLogin ? { email, password } : { name, email, password };

            const res = await axios.post(endpoint, payload);
            
            if (isLogin) {
                localStorage.setItem('token', res.data.token); // Store token
                alert("Login successful!");
                navigate('/dashboard');
            } else {
                alert("Signup successful! Please login.");
                setIsLogin(true);
            }
        } catch (error) {
            console.error("Auth error:", error);
            alert(error.response?.data?.message || "Authentication failed.");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Segoe UI, sans-serif' }}>
            <div style={{ width: '100%', maxWidth: '420px', padding: '40px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', color: '#1e293b' }}>
                
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ margin: '0 0 8px 0', fontSize: '26px', fontWeight: '800', color: '#0f172a' }}>
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
                        {isLogin ? 'Enter your credentials to access dashboard' : 'Register to start managing finances'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {!isLogin && (
                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '6px' }}>FULL NAME</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Enter your name" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
                        </div>
                    )}

                    <div>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '6px' }}>EMAIL ADDRESS</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>

                    <div>
                        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '6px' }}>PASSWORD</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>

                    <button type="submit" style={{ padding: '14px', backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(79,70,229,0.2)', marginTop: '10px' }}>
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '25px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#4f46e5', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', padding: 0 }}>
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Auth;