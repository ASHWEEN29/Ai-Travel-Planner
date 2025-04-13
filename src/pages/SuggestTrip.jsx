import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { motion } from 'framer-motion';
import getAICompletion from './AiService';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db, auth } from '../Auth/firebaseConfig';

const tripTypes = [
  { value: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { value: 'Solo', emoji: '👤' },
  { value: 'Couple', emoji: '💑' },
  { value: 'Friends', emoji: '👫' },
];

function SuggestTrip() {
  const [tripPlan, setTripPlan] = useState('');
  const [numberOfDays, setNumberOfDays] = useState('');
  const [budget, setBudget] = useState('');
  const [typeOfTrip, setTypeOfTrip] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [locationDetected, setLocationDetected] = useState(false);

  // Reverse geocode from lat/lon to city using OpenStreetMap
  const getCityFromCoords = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      const city =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.state ||
        '';
      if (city) {
        setUserLocation(city);
        setLocationDetected(true);
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  // Auto-detect user location on load
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getCityFromCoords(latitude, longitude);
      },
      (error) => {
        console.warn('Geolocation denied or failed:', error.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!numberOfDays || !budget || !typeOfTrip || !userLocation) {
      alert('Please fill out all fields.');
      return;
    }

    const prompt = `Generate a day-wise travel itinerary for a ${typeOfTrip} trip lasting ${numberOfDays} days with a budget of ₹${budget}, starting from ${userLocation}. Keep it short, simple, and within 400 words.`;

    try {
      const plan = await getAICompletion(prompt);
      setTripPlan(plan);

      const user = auth.currentUser;
      if (user) {
        const visitRef = doc(collection(db, 'users', user.uid, 'suggestedTrips'));
        await setDoc(visitRef, {
          numberOfDays,
          budget,
          typeOfTrip,
          userLocation,
          tripPlan: plan,
          generatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Failed to generate trip plan:', error);
    }
  };

  const handleDownloadPDF = () => {
    if (!tripPlan) return;
    const docPDF = new jsPDF();
    const lines = docPDF.splitTextToSize(tripPlan, 180);
    docPDF.text(lines, 10, 10);
    docPDF.save('suggested-trip-plan.pdf');
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen py-12 px-4 bg-blue-100">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h1 className="font-bold text-gray-800 text-4xl mb-6 text-center">
          🌍 Get Your Suggested Trip Plan 🚀
        </h1>
        <p className="text-gray-600 text-lg text-center mb-10">
          Enter your preferences and receive a tailored trip itinerary instantly.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-800 text-2xl font-bold mb-2">Where are you from?</label>
            <input
              type="text"
              value={userLocation}
              onChange={(e) => {
                setUserLocation(e.target.value);
                setLocationDetected(false); // Allow manual override
              }}
              className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="e.g., Mumbai"
              required
            />
            {locationDetected && (
              <p className="text-green-600 mt-1 text-sm">
                📍 Location auto-detected. You can change it if needed.
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-800 text-2xl font-bold mb-2">Number of Days:</label>
            <input
              type="number"
              value={numberOfDays}
              onChange={(e) => setNumberOfDays(e.target.value)}
              className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="e.g., 5"
              required
            />
          </div>

          <div>
            <label className="block text-gray-800 text-2xl font-bold mb-2">Budget (₹):</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="e.g., 20000"
              required
            />
          </div>

          <div>
            <label className="block text-gray-800 text-2xl font-bold mb-2">Type of Trip:</label>
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

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 text-lg rounded-lg hover:bg-blue-600 transition"
            >
              Get Plan
            </button>
          </div>
        </form>

        {tripPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-100 p-6 mt-8 rounded-lg border border-gray-300"
          >
            <h2 className="text-gray-800 text-2xl font-bold mb-4">Your Suggested Trip Plan:</h2>
            <p className="text-gray-900 text-lg whitespace-pre-line break-words">{tripPlan}</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleDownloadPDF}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition"
              >
                Download PDF
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default SuggestTrip;
