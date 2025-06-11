// src/components/auth/SignUp.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Import Firebase auth and db functions
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; 
import { auth, db } from '../../firebase'; // Correct path to firebase config
import './Login.css';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      if (user) {
        // Create a new document in the 'users' collection with the user's UID
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: '', // User can set this in their profile later
          createdAt: new Date().toISOString(),
        });
        navigate('/dashboard'); // Navigate to dashboard on successful sign-up
      }
    } catch (error) {
      console.error("Firebase signup error:", error);
      if (error.code === 'auth/email-already-in-use') {
        setError('This email address is already in use.');
      } else {
        setError('Failed to create an account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // The JSX part of the component remains the same
  return (
    <div className="auth-container">
      <div className="auth-form-card">
        <h2 className="auth-title">Create Your Account</h2>
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
              placeholder="•••••••• (min. 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              className="input-field"
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button className="button-primary" type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            <Link to="/login" className="auth-link">
              Already have an account? Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;