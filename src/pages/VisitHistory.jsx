import React, { useEffect, useState } from "react";
import { db } from "../Auth/firebaseConfig"; // Adjust path as necessary
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import userStore from "../context/store";
import { jsPDF } from "jspdf";

const VisitHistory = () => {
  const navigate = useNavigate();
  const { user } = userStore();
  const [visitHistory, setVisitHistory] = useState([]);

  useEffect(() => {
    if (user) {
      fetchVisitHistory(user.uid);
    } else {
      navigate("/auth");
    }
  }, [user, navigate]);

  const fetchVisitHistory = async (uid) => {
    const visitsCollection = collection(db, "users", uid, "visits");
    const querySnapshot = await getDocs(visitsCollection);
    const history = querySnapshot.docs.map((doc) => doc.data());
    setVisitHistory(history);
  };

  const handleDownloadPDF = (visit) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("Trip Plan", 10, 10);
    doc.setFont("helvetica", "normal");

    const tripDetails = `
    Location: ${visit.location}
    Number of Days: ${visit.numberOfDays}
    Budget: ${visit.budget}
    Type of Trip: ${visit.typeOfTrip}
    Date: ${new Date(visit.visitedAt).toLocaleDateString()}
    
    Trip Plan:
    ${visit.tripPlan || "No detailed plan available."}
    `;

    const lines = doc.splitTextToSize(tripDetails, 180);
    doc.text(lines, 10, 20);
    doc.save(`${visit.location}_Trip_Plan.pdf`);
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/")} style={styles.button}>
        Back to Home
      </button>
      <h2 style={styles.title}>Your Visit History</h2>
      {visitHistory.length > 0 ? (
        <ul style={styles.historyList}>
          {visitHistory.map((visit, index) => (
            <li key={index} style={styles.historyItem}>
              <strong>Location:</strong> {visit.location}
              <br />
              <strong>Number of Days:</strong> {visit.numberOfDays}
              <br />
              <strong>Budget:</strong> {visit.budget}
              <br />
              <strong>Type of Trip:</strong> {visit.typeOfTrip}
              <br />
              <strong>Date:</strong> {new Date(visit.visitedAt).toLocaleDateString()}
              <br />
              <button onClick={() => handleDownloadPDF(visit)} style={styles.pdfButton}>
                📄 Download PDF
              </button>
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f0f4f8",
    color: "#444",
    minHeight: "100vh",
    width: "100vw",
    boxSizing: "border-box",
    overflowY: "auto",
    textAlign: "center",
  },
  button: {
    padding: "1rem 2rem",
    fontSize: "1rem",
    backgroundColor: "#1d72b8",
    color: "#ffffff",
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    marginBottom: "20px",
    transition: "background-color 0.3s ease",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  historyList: {
    listStyleType: "none",
    padding: "0",
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
  },
  historyItem: {
    marginBottom: "15px",
    padding: "15px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "0.5rem",
    boxShadow: "0 3px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
  },
  pdfButton: {
    marginTop: "10px",
    padding: "10px 15px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default VisitHistory;
