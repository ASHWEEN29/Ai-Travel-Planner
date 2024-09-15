import React from "react";

// Function to handle AI completions
const getAICompletion = async (prompt) => {
    try {
        // Check and log the length of the original prompt
        console.log("Original Prompt Length:", prompt.length);

        // Truncate the prompt if it exceeds 256 characters
        const truncatedPrompt = prompt.length > 256 ? prompt.slice(0, 256) : prompt;

        // Log the truncated prompt length to verify
        console.log("Truncated Prompt Length:", truncatedPrompt.length);

        // Ensure the API key is correctly retrieved
        const apiKey = import.meta.env.VITE_APP_API_KEY;

        // Perform the API call with the truncated prompt
        const response = await fetch('https://api.aimlapi.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}` // Ensure API key is correct
            },
            body: JSON.stringify({
                model: 'gemini-1.5-flash', // Ensure the correct model is being used
                messages: [{ role: 'user', content: truncatedPrompt }], // Messages must be 256 characters or less
                max_tokens: 500
            })
        });

        // Handle rate limiting error (429)
        if (response.status === 429) {
            const errorBody = await response.text();
            console.error(`Rate limit exceeded: ${errorBody}`);
            throw new Error('Rate limit exceeded, please try again later.');
        }

        // Handle any other response error
        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`API request failed with status ${response.status}: ${errorBody}`);
            throw new Error(`API request failed with status ${response.status}`);
        }

        // Parse the API response
        const data = await response.json();
        const messageContent = data.choices[0]?.message?.content || '';

        // Remove any unwanted characters (like # or *) from the response
        const cleanedContent = messageContent.replace(/[#*]/g, '');
        console.log("API Response:", cleanedContent);

        return cleanedContent;

    } catch (error) {
        // Handle any other errors during the process
        console.error('Error in getAICompletion:', error.message || error);
        throw new Error('Failed to get AI completion');
    }
};

export default getAICompletion;
