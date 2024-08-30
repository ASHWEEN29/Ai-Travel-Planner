// src/pages/TripForm.jsx

import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import getAICompletion from './AiService';
import { db, auth } from '../Auth/firebaseConfig';
import { doc, setDoc, collection } from "firebase/firestore"; 
import PlanDisplay from './PlanDisplay';

const cities = [
    "Mumbai, Maharashtra, India",
  "Delhi, Delhi, India",
  "Bangalore, Karnataka, India",
  "Hyderabad, Telangana, India",
  "Ahmedabad, Gujarat, India",
  "Chennai, Tamil Nadu, India",
  "Kolkata, West Bengal, India",
  "Surat, Gujarat, India",
  "Pune, Maharashtra, India",
  "Jaipur, Rajasthan, India",
  "New York, USA",
  "Los Angeles, USA",
  "London, UK",
  "Paris, France",
  "Tokyo, Japan",
  "Shanghai, China",
  "Beijing, China",
  "Istanbul, Turkey",
  "Buenos Aires, Argentina",
  "Moscow, Russia",
  "São Paulo, Brazil",
  "Mexico City, Mexico",
  "Cairo, Egypt",
  "Sydney, Australia",
  "Seoul, South Korea",
  "Jakarta, Indonesia",
  "Lagos, Nigeria",
  "Karachi, Pakistan",
  "Dubai, UAE",
  "Bangkok, Thailand",
  "Hong Kong, Hong Kong",
  "Singapore, Singapore",
  "Madrid, Spain",
  "Barcelona, Spain",
  "Berlin, Germany",
  "Rome, Italy",
  "Toronto, Canada",
  "Vancouver, Canada",
  "Kuala Lumpur, Malaysia",
  "Riyadh, Saudi Arabia",
  "Tehran, Iran",
  "Lima, Peru",
  "Santiago, Chile",
  "Manila, Philippines",
  "Melbourne, Australia",
  "Chicago, USA",
  "San Francisco, USA",
  "Miami, USA",
  "Rio de Janeiro, Brazil",
  "Ho Chi Minh City, Vietnam",
  "Warsaw, Poland",
  "Vienna, Austria",
  "Zurich, Switzerland",
  "Amsterdam, Netherlands",
  "Brussels, Belgium",
  "Stockholm, Sweden",
  "Oslo, Norway",
  "Copenhagen, Denmark",
  "Dublin, Ireland",
  "Lisbon, Portugal",
  "Athens, Greece",
  "Budapest, Hungary",
  "Prague, Czech Republic",
  "Helsinki, Finland",
  "Brisbane, Australia",
  "Auckland, New Zealand",
  "Cape Town, South Africa",
  "Johannesburg, South Africa",
  "Tel Aviv, Israel",
  "Kyiv, Ukraine",
  "Bucharest, Romania",
  "Belgrade, Serbia",
  "Havana, Cuba",
  "Sofia, Bulgaria",
  "Nairobi, Kenya",
  "Abu Dhabi, UAE",
  "Doha, Qatar",
  "Muscat, Oman",
  "Beirut, Lebanon",
  "Tashkent, Uzbekistan",
  "Almaty, Kazakhstan",
  "Ashgabat, Turkmenistan",
  "Colombo, Sri Lanka",
  "Kathmandu, Nepal",
  "Phnom Penh, Cambodia",
  "Vientiane, Laos",
  "Thimphu, Bhutan",
  "Minsk, Belarus",
  "Tbilisi, Georgia",
  "Yerevan, Armenia",
  "Baku, Azerbaijan",
  "Skopje, North Macedonia",
  "Tirana, Albania",
  "Podgorica, Montenegro",
  "Sarajevo, Bosnia and Herzegovina"
  ];
  

function TripForm() {
  const [tripPlan, setTripPlan] = useState('');
  const [location, setLocation] = useState('');
  const [numberOfDays, setNumberOfDays] = useState('');
  const [budget, setBudget] = useState('');
  const [typeOfTrip, setTypeOfTrip] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const prompt = `
      Generate a day-wise travel plan for a ${typeOfTrip} trip to ${location}. 
      The trip will last ${numberOfDays} days with a budget of ${budget}. 
      Provide a detailed itinerary daywise next day in next line, including activities, dining options, and any recommendations.
      within 400 tokens
    `;

    try {
      const plan = await getAICompletion(prompt);
      setTripPlan(plan);

      const user = auth.currentUser;
      if (user) {
        // Save data to Firestore
        const visitRef = doc(collection(db, "users", user.uid, "visits"));
        await setDoc(visitRef, {
          location,
          numberOfDays,
          budget,
          typeOfTrip,
          tripPlan: plan,
          visitedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Failed to submit trip data:", error);
    }
  };

  const handleDownloadPDF = () => {
    if (!tripPlan) return;

    const doc = new jsPDF();
    const lines = doc.splitTextToSize(tripPlan, 180); // 180 is the width of the text box
    doc.text(lines, 10, 10);
    doc.save('trip-plan.pdf');
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);

    if (value.length > 2) {
      const filteredSuggestions = cities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setIsDropdownOpen(true);
    } else {
      setSuggestions([]);
      setIsDropdownOpen(false);
    }
  };

  const handleSuggestionClick = (city) => {
    setLocation(city);
    setSuggestions([]);
    setIsDropdownOpen(false);
  };

  const handleDocumentClick = (e) => {
    if (!e.target.closest('.dropdown')) {
      setIsDropdownOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.dropdownContainer}>
            <label style={styles.label}>
              Location:
              <input 
                type="text" 
                value={location} 
                onChange={handleLocationChange} 
                style={styles.input}
              />
            </label>
            {isDropdownOpen && suggestions.length > 0 && (
              <ul style={styles.suggestions}>
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    style={styles.suggestionItem}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <br />
          <label style={styles.label}>
            Number of Days:
            <input 
              type="number" 
              value={numberOfDays} 
              onChange={(e) => setNumberOfDays(e.target.value)} 
              style={styles.input}
            />
          </label>
          <br />
          <label style={styles.label}>
            Budget:
            <input 
              type="text" 
              value={budget} 
              onChange={(e) => setBudget(e.target.value)} 
              style={styles.input}
            />
          </label>
          <br />
          <div style={styles.radioGroup}>
            <span style={styles.label}>Type of Trip:</span>
            {['Family', 'Couple', 'Solo', 'Friends'].map((type) => (
              <label key={type} style={styles.radioLabel}>
                <input
                  type="radio"
                  name="tripType"
                  value={type}
                  checked={typeOfTrip === type}
                  onChange={(e) => setTypeOfTrip(e.target.value)}
                  style={styles.radioInput}
                />
                <span style={typeOfTrip === type ? { ...styles.radioButton, ...styles.radioButtonChecked } : styles.radioButton}></span>
                {type}
              </label>
            ))}
          </div>
          <br />
          <button type="submit" style={styles.button}>Generate Plan</button>
        </form>
        {tripPlan && (
          <>
            <button 
              onClick={handleDownloadPDF}
              style={{ ...styles.button, marginTop: '20px' }}
            >
              Download PDF
            </button>
            <PlanDisplay tripPlan={tripPlan} />
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#000', // Black background for the page
    color: '#fff', // White text for contrast
  },
  formWrapper: {
    backgroundColor: '#1e1e1e', // Dark background for the form
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
    width: '100%',
    maxWidth: '800px', // Set max width for larger screens
    boxSizing: 'border-box',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  label: {
    marginBottom: '10px',
    fontWeight: 'bold',
    color: '#ccc', // Lighter color for labels
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #444', // Dark border
    backgroundColor: '#333', // Dark background for inputs
    color: '#fff', // Light text color
    width: '100%',
    marginTop: '5px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '5px',
    color: '#ccc',
  },
  radioInput: {
    display: 'none',
  },
  radioButton: {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: '2px solid #28a745',
    marginRight: '10px',
    verticalAlign: 'middle',
    position: 'relative',
  },
  radioButtonChecked: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  dropdownContainer: {
    position: 'relative',
    width: '100%',
  },
  suggestions: {
    listStyleType: 'none',
    padding: '0',
    margin: '0',
    border: '1px solid #444',
    borderRadius: '5px',
    width: '100%',
    backgroundColor: '#333',
    boxShadow: '0 2px 5px rgba(255, 255, 255, 0.2)',
    position: 'absolute',
    zIndex: '1000',
    maxHeight: '150px',
    overflowY: 'auto',
  },
  suggestionItem: {
    padding: '10px',
    cursor: 'pointer',
    borderBottom: '1px solid #444',
    color: '#fff',
  },
  suggestionItemHover: {
    backgroundColor: '#444',
  },
};

export default TripForm;
