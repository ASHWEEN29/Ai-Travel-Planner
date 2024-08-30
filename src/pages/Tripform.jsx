import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import getAICompletion from './AiService';
import userStore from '../context/store';
import { useNavigate } from 'react-router-dom';
import PlanDisplay from './PlanDisplay';

function TripForm() {
    const navigate = useNavigate();
    const [tripPlan,setTripPlan] = useState();
    const [location, setLocation] = useState('');
    const [numberOfDays, setNumberOfDays] = useState('');
    const [budget, setBudget] = useState('');
    const [typeOfTrip, setTypeOfTrip] = useState('');
  
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
        } catch (error) {
            console.error('Failed to submit trip data:', error);
        }
    };

    const handleDownloadPDF = () => {
        if (!tripPlan) return;
        
        const doc = new jsPDF();
        doc.text(tripPlan, 10, 10);
        doc.save('trip-plan.pdf');
    };

    return (
        <div style={{ padding: '20px' }}>
            <form onSubmit={handleSubmit}>
                <label>
                    Location:
                    <input 
                        type="text" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                    />
                </label>
                <br />
                <label>
                    Number of Days:
                    <input 
                        type="number" 
                        value={numberOfDays} 
                        onChange={(e) => setNumberOfDays(e.target.value)} 
                    />
                </label>
                <br />
                <label>
                    Budget:
                    <input 
                        type="text" 
                        value={budget} 
                        onChange={(e) => setBudget(e.target.value)} 
                    />
                </label>
                <br />
                <label>
                    Type of Trip:
                    <input 
                        type="text" 
                        value={typeOfTrip} 
                        onChange={(e) => setTypeOfTrip(e.target.value)} 
                    />
                </label>
                <br />
                <button type="submit">Generate Plan</button>
            </form>
            {tripPlan && (
                <button 
                    onClick={handleDownloadPDF}
                    style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', position:'top' }}
                >
                    Download PDF
                </button>
            )}
             {tripPlan?<PlanDisplay tripPlan={tripPlan}/>:<></>}
        </div>
       
    );
}

export default TripForm;
