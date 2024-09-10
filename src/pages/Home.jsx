// src/pages/Home.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, signOut } from '../Auth/firebaseConfig';
import userStore from '../context/store';

const Home = () => {
  const navigate = useNavigate();
  const { user } = userStore();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <p style={styles.welcomeText}>Welcome to Trip Planner</p>
        <p style={styles.tagline}>Your adventure begins here. Plan, explore, and enjoy!</p>
        {user ? (
          <div style={styles.userContainer}>
            <p style={styles.userEmail}>Logged in as: {user.email}</p>
            <div style={styles.buttonContainer}>
              <Link to='/make-trip' style={styles.button}>Get Started</Link>
              <Link to='/visit-history' style={styles.button}>View History</Link>
              <button onClick={handleLogout} style={styles.button}>Logout</button>
            </div>
          </div>
        ) : (
          <Link to="/auth" style={styles.loginButton}>Login with Google</Link>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    overflowY: 'auto',
    textAlign: 'center',
    fontFamily: "'Poppins', sans-serif",
    background: 'linear-gradient(to right, #f0f4f8, #e2e8f0)',
    color: '#444',
    padding: '20px',
    boxSizing: 'border-box',
    margin: 0,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1200px',
    padding: '2rem',
    boxSizing: 'border-box',
    animation: 'fadeIn 1s ease-out',
    borderRadius: '0.75rem',
    backgroundColor: '#fff',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
  },
  welcomeText: {
    fontSize: '3rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: '#333',
    animation: 'fadeIn 1.5s ease-out',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
  },
  tagline: {
    fontSize: '1.5rem',
    fontWeight: '300',
    color: '#666',
    marginBottom: '2rem',
    fontStyle: 'italic',
    animation: 'fadeIn 2s ease-out',
    maxWidth: '80%',
  },
  userContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
    width: '100%',
    maxWidth: '800px',
    animation: 'slideIn 1s ease-out',
    marginTop: '2rem',
    transition: 'transform 0.3s ease-in-out',
  },
  userEmail: {
    fontSize: '1.2rem',
    fontWeight: '500',
    marginBottom: '1.5rem',
    color: '#555',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: '1rem',
  },
  button: {
    display: 'inline-block',
    padding: '1rem 2rem',
    fontSize: '1rem',
    backgroundColor: '#1d72b8',
    color: '#ffffff',
    textDecoration: 'none',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    animation: 'fadeIn 2s ease-out',
    fontWeight: '600',
    letterSpacing: '0.5px',
    ':hover': {
      backgroundColor: '#155a8a',
      transform: 'translateY(-2px)',
    },
  },
  loginButton: {
    padding: '1rem 2rem',
    fontSize: '1.2rem',
    backgroundColor: '#28A745',
    color: '#fff',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    animation: 'fadeIn 2.5s ease-out',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
  '@keyframes slideIn': {
    '0%': {
      transform: 'translateY(-20px)',
      opacity: 0,
    },
    '100%': {
      transform: 'translateY(0)',
      opacity: 1,
    },
  },
};

export default Home;
