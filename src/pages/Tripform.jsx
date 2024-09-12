import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import getAICompletion from './AiService'; // Ensure this path is correct
import { doc, setDoc, collection } from 'firebase/firestore'; 
import { db, auth } from '../Auth/firebaseConfig'; // Ensure this path is correct

const tripTypes = [
  { value: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { value: 'Solo', emoji: '👤' },
  { value: 'Couple', emoji: '💑' },
  { value: 'Friends', emoji: '👫' },
];

const cities = [  ];

function useTypewriterEffect(text, delay = 50) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let currentIndex = 0;

    if (!text) return;

    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + text[currentIndex]);
      currentIndex++;

      if (currentIndex === text.length) {
        clearInterval(timer);
      }
    }, delay);

    return () => clearInterval(timer); // Clean up the timer on component unmount
  }, [text, delay]);

  return displayedText;
}

function TripForm() {
  const [tripPlan, setTripPlan] = useState('');
  const [location, setLocation] = useState('');
  const [numberOfDays, setNumberOfDays] = useState('');
  const [budget, setBudget] = useState('');
  const [typeOfTrip, setTypeOfTrip] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const typedTripPlan = useTypewriterEffect(tripPlan, 50); // 50ms delay between characters

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields
    if (!location || !numberOfDays || !budget || !typeOfTrip) {
      alert('Please fill out all fields.');
      return;
    }

    const prompt = `
      Generate a day-wise travel plan for a ${typeOfTrip} trip to ${location}. 
      The trip will last ${numberOfDays} days with a budget of ${budget}. 
      Provide a detailed itinerary daywise next day in next line, including activities, dining options, and any recommendations.
      within 400 tokens
    `;

    try {
      console.log('Prompt:', prompt); // Log the prompt to ensure it's correct
      const plan = await getAICompletion(prompt);
      console.log('Plan:', plan); // Log the received plan
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

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen py-12 px-4">
      <div className="w-full max-w-5xl bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h1 className="font-bold text-gray-800 text-4xl mb-6 text-center">
          Plan Your Perfect Trip 🚀🌎
        </h1>
        <p className="text-gray-600 text-lg text-center max-w-prose mx-auto mb-10">
          Share your travel preferences and we'll craft a customized itinerary just for you.
        </p>

        <div className="flex flex-col lg:flex-row lg:space-x-10">
          {/* Container for Form and Trip Plan */}
          <div className="flex flex-col w-full lg:w-1/2">
            {/* Form Section */}
            <div className="mb-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="relative">
                  <label className="block text-gray-800 text-2xl font-bold mb-2">
                    Destination:
                  </label>
                  <input 
                    type="text" 
                    value={location} 
                    onChange={handleLocationChange} 
                    className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                    placeholder="Enter your destination"
                    required
                  />
                  {isDropdownOpen && suggestions.length > 0 && (
                    <ul className="absolute top-full left-0 right-0 border border-gray-300 rounded-lg mt-2 max-h-48 overflow-y-auto bg-white shadow-lg z-10">
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="cursor-pointer p-3 hover:bg-gray-200 transition"
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <label className="block text-gray-800 text-2xl font-bold mb-2">
                    Number of Days:
                  </label>
                  <input 
                    type="number" 
                    value={numberOfDays} 
                    onChange={(e) => setNumberOfDays(e.target.value)} 
                    className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                    placeholder="e.g., 5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-800 text-2xl font-bold mb-2">
                    Budget:
                  </label>
                  <input 
                    type="text" 
                    value={budget} 
                    onChange={(e) => setBudget(e.target.value)} 
                    className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                    placeholder="e.g., $2000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-800 text-2xl font-bold mb-2">
                    Type of Trip:
                  </label>
                  <div className="radio-group">
                    {tripTypes.map((type) => (
                      <label key={type.value} className="flex items-center cursor-pointer mb-3">
                        <input
                          type="radio"
                          name="typeOfTrip"
                          value={type.value}
                          checked={typeOfTrip === type.value}
                          onChange={() => setTypeOfTrip(type.value)}
                          className="hidden"
                          required
                        />
                        <div className={`radio-box ${typeOfTrip === type.value ? 'border-teal-500 bg-teal-50' : ''}`}>
                          {type.emoji}
                        </div>
                        <span className="ml-2 text-xl font-semibold">{type.value}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button type="submit" className="bg-teal-500 text-white hover:bg-teal-600 transition">Generate Plan</button>
                  {tripPlan && (
                    <button type="button" onClick={handleDownloadPDF} className="bg-gray-500 text-white hover:bg-gray-600 transition">Download PDF</button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Generated Text Section */}
          {tripPlan && (
            <div className="w-full lg:w-1/2 bg-gray-100 p-6 rounded-lg border border-gray-300 max-w-full">
              <h2 className="text-gray-800 text-2xl font-bold mb-4">Your Trip Plan:</h2>
              <p className="text-gray-900 text-lg font-bold whitespace-pre-line break-words">
                {typedTripPlan}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TripForm;
