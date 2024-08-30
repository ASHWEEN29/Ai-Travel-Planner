import React from "react";

 // Ensure this is correct

const getAICompletion = async (prompt) => {
    try {
        console.log(prompt )
        const apiKey = '657bb6e8603f489d8f61df60374198bc';
        const response = await fetch('https://api.aimlapi.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gemini-1.5-flash', 
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 500
            })
        });
       
        if (response.status === 429) {
            const errorBody = await response.text();
            console.error(`Rate limit exceeded: ${errorBody}`);
            throw new Error('Rate limit exceeded, please try again later.');
        }

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`API request failed with status ${response.status}: ${errorBody}`);
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        let content = data.choices[0]?.message?.content || '';
        
        content = content.replace(/[#*]/g, '');
        const days = content.split(/\n+/).filter(day => day.trim() !== '');
        return days.map(day => day.trim()).join(' ');

    } catch (error) {
        console.error('Error in getAICompletion:', error.message || error);
        throw new Error('Failed to get AI completion');
    }
};


export default getAICompletion