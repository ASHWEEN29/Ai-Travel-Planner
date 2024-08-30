// src/pages/Home.jsx

import React, { useEffect, useState } from 'react';
import { auth, signOut, db } from '../Auth/firebaseConfig';
import { collection, getDocs } from "firebase/firestore"; 
import { Link, useNavigate } from 'react-router-dom';
import userStore from '../context/store';

const Home = () => {
  const navigate = useNavigate();
  const { user } = userStore();
  const [visitHistory, setVisitHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false); // Toggle for history

  useEffect(() => {
    if (user) {
      fetchVisitHistory(user.uid);
    }
  }, [user]);

  const fetchVisitHistory = async (uid) => {
    const visitsCollection = collection(db, "users", uid, "visits");
    const querySnapshot = await getDocs(visitsCollection);

    const history = querySnapshot.docs.map(doc => doc.data());
    setVisitHistory(history);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div style={styles.container}>
      <p style={styles.welcomeText}>Welcome to Trip Planner</p>
      {user ? (
        <div style={styles.userContainer}>
          <p style={styles.userEmail}>Logged in as: {user.email}</p>
          <Link to='/make-trip' style={styles.button}>Get Started</Link>
          <button onClick={toggleHistory} style={styles.button}>
            {showHistory ? 'Hide History' : 'View History'}
          </button>
          <button onClick={handleLogout} style={styles.button}>Logout</button>
          
          {showHistory && visitHistory.length > 0 && (
            <div style={styles.historyContainer}>
              <h3>Your Visit History</h3>
              <ul style={styles.historyList}>
                {visitHistory.map((visit, index) => (
                  <li key={index} style={styles.historyItem}>
                    <strong>Location:</strong> {visit.location}<br />
                    <strong>Number of Days:</strong> {visit.numberOfDays}<br />
                    <strong>Budget:</strong> {visit.budget}<br />
                    <strong>Type of Trip:</strong> {visit.typeOfTrip}<br />
                    <strong>Trip Plan:</strong> <pre>{visit.tripPlan}</pre><br />
                    <strong>Date:</strong> {new Date(visit.visitedAt).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <Link to="/auth" style={styles.button}>Login with Google</Link>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  welcomeText: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  userContainer: {
    display: 'inline-block',
    textAlign: 'left',
  },
  userEmail: {
    marginBottom: '10px',
  },
  button: {
    display: 'inline-block',
    marginTop: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: '#FFFFFF',
    textDecoration: 'none',
    borderRadius: '5px',
    marginRight: '10px',
    border: 'none',
    cursor: 'pointer',
  },
  historyContainer: {
    marginTop: '20px',
    textAlign: 'left',
  },
  historyList: {
    listStyleType: 'none',
    padding: '0',
  },
  historyItem: {
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
};

export default Home;
