import React, { useEffect, useState } from 'react';

function PlanDisplay({tripPlan}) {
    
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    
    useEffect(() => {
        if (tripPlan) {
            const planString = JSON.stringify(tripPlan, null, 2);
            let currentText = '';
            let index = 0;

            const typingEffect = setInterval(() => {
                if (index < planString.length) {
                    currentText += planString[index];
                    setDisplayText(currentText);
                    index++;
                } else {
                    setIsTyping(false);
                    clearInterval(typingEffect);
                }
            }, 20); // Adjust the speed of the typing effect here

            return () => clearInterval(typingEffect);
        }
    }, [tripPlan]);

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Your Trip Plan</h2>
            {tripPlan ? (
                <pre style={styles.planText}>
                    {isTyping ? displayText : JSON.stringify(tripPlan, null, 2)}
                </pre>
            ) : (
                <p style={styles.noPlanText}>No plan available</p>
            )}
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: '#f0f4f8',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '8000px',
        margin: '40px auto',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
    },
    heading: {
        fontSize: '28px',
        marginBottom: '20px',
        color: '#333',
        textAlign: 'center',
    },
    planText: {
        backgroundColor: 'black',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        fontSize: '16px',
        whiteSpace: 'pre-wrap',
        fontFamily: 'monospace',
        height: '400px', // Increased height of the output box
        overflowY: 'auto',
        lineHeight: '1.5',
        border: '1px solid #ccc',
        maxWidth:'50000px',
    },
    noPlanText: {
        color: '#666',
        fontSize: '18px',
        textAlign: 'center',
    },
};

export default PlanDisplay;
