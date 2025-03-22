import React from "react";

const getAICompletion = async (prompt) => {
    try {
        console.log("Original Prompt Length:", prompt.length);

        const truncatedPrompt = prompt.length > 256 ? prompt.slice(0, 256) : prompt;
        console.log("Truncated Prompt Length:", truncatedPrompt.length);

        const apiKey = import.meta.env.VITE_APP_GROQ_API_KEY;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",  // Ensure this model exists in Groq
                messages: [{ role: "user", content: truncatedPrompt }],
                temperature: 1,
                max_tokens: 500,
                top_p: 1,
                stream: false
            })
        });

        if (response.status === 429) {
            const errorBody = await response.text();
            console.error(`Rate limit exceeded: ${errorBody}`);
            throw new Error("Rate limit exceeded, please try again later.");
        }

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`API request failed with status ${response.status}: ${errorBody}`);
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const messageContent = data.choices[0]?.message?.content || "";

        const cleanedContent = messageContent.replace(/[#*]/g, "");
        console.log("API Response:", cleanedContent);

        return cleanedContent;
    } catch (error) {
        console.error("Error in getAICompletion:", error.message || error);
        throw new Error("Failed to get AI completion");
    }
};

export default getAICompletion;
