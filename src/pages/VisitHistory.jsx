// src/pages/VisitHistory.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../Auth/firebaseConfig'; // Adjust path as necessary
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import userStore from '../context/store';

const VisitHistory = () => {
  const navigate = useNavigate();
  const { user } = userStore();
  const [visitHistory, setVisitHistory] = useState([]);

  useEffect(() => {
    if (user) {
      fetchVisitHistory(user.uid);
    } else {
      navigate('/auth');
    }
  }, [user, navigate]);

  const fetchVisitHistory = async (uid) => {
    const visitsCollection = collection(db, 'users', uid, 'visits');
    const querySnapshot = await getDocs(visitsCollection);
    const history = querySnapshot.docs.map((doc) => doc.data());
    setVisitHistory(history);
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/')} style={styles.button}>
        Back to Home
      </button>
      <h2 style={styles.title}>Your Visit History</h2>
      {visitHistory.length > 0 ? (
        <ul style={styles.historyList}>
          {visitHistory.map((visit, index) => (
            <li key={index} style={styles.historyItem}>
              <strong>Location:</strong> {visit.location}<br />
              <strong>Number of Days:</strong> {visit.numberOfDays}<br />
              <strong>Budget:</strong> {visit.budget}<br />
              <strong>Type of Trip:</strong> {visit.typeOfTrip}<br />
              <strong>Date:</strong> {new Date(visit.visitedAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No visit history found.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: '#f0f4f8',
    color: '#444',
    minHeight: '100vh', // Ensure it takes up full viewport height
    width: '100vw', // Ensure it takes up full viewport width
    boxSizing: 'border-box',
    overflowY: 'auto',
    textAlign: 'center',
  },
  button: {
    padding: '1rem 2rem',
    fontSize: '1rem',
    backgroundColor: '#1d72b8',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'background-color 0.3s ease',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  historyList: {
    listStyleType: 'none',
    padding: '0',
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
  },
  historyItem: {
    marginBottom: '15px',
    padding: '15px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '0.5rem',
    boxShadow: '0 3px 8px rgba(0, 0, 0, 0.1)',
  },
};

export default VisitHistory;
