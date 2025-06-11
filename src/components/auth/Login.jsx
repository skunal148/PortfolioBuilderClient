// src/components/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Import Firebase auth functions
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase'; // Correct path to firebase config
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); 
    } catch (error) {
      console.error("Firebase login error:", error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else {
        setError('Failed to log in. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // The JSX part of the component remains the same
  return (
    <div className="auth-container">
      <div className="auth-form-card">
        <h2 className="auth-title">Welcome Back!</h2>
        {error && <p className="auth-error-message">{error}</p>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label className="input-label" htmlFor="email">Email Address</label>
            <input
              className="input-field"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <input
              className="input-field"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button className="button-primary" type="submit" disabled={loading}>
              {loading ? 'Logging In...' : 'Log In'}
            </button>
            <Link to="/signup" className="auth-link">
              Don't have an account? Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;