import React, { useState } from 'react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!numberOfDays || !budget || !typeOfTrip) {
      alert('Please fill out all fields.');
      return;
    }

    const prompt = `Generate a day-wise travel plan for a ${typeOfTrip} trip lasting ${numberOfDays} days with a budget of ₹${budget}. Keep it within 400 words, short and simple.`;

    try {
      const plan = await getAICompletion(prompt);
      setTripPlan(plan);

      const user = auth.currentUser;
      if (user) {
        const visitRef = doc(collection(db, "users", user.uid, "suggestedTrips"));
        await setDoc(visitRef, {
          numberOfDays,
          budget,
          typeOfTrip,
          tripPlan: plan,
          generatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Failed to generate trip plan:", error);
    }
  };

  const handleDownloadPDF = () => {
    if (!tripPlan) return;
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(tripPlan, 180);
    doc.text(lines, 10, 10);
    doc.save('suggested-trip-plan.pdf');
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
