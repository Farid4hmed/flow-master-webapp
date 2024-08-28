import { GoogleGenerativeAI } from "@google/generative-ai";

// Your API Key
const API_KEY = process.env.NEXT_PUBLIC_API_KEY; // Replace with your actual Google API key

// Initialize the Generative AI client
const genAI = new GoogleGenerativeAI(API_KEY);

// Set the model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to store conversation in local storage
function storeInLocalStorage(userId, reqId, query, response) {
    const key = `${userId}_${reqId}`;
    let conversationHistory = JSON.parse(localStorage.getItem(key)) || [];
    conversationHistory.push({ user: query, bot: response });
    localStorage.setItem(key, JSON.stringify(conversationHistory));
}

// Function to retrieve conversation history from local storage
function getConversationHistory(userId, reqId) {
    const key = `${userId}_${reqId}`;
    return JSON.parse(localStorage.getItem(key)) || [];
}

// Function to clear conversation history from local storage
function clearConversationHistory(userId, reqId) {
    const key = `${userId}_${reqId}`;
    localStorage.removeItem(key);
}

// Function to call Google Gemini API for generating responses
async function callGeminiAPI(prompt) {
    try {
        // Generate content using the specified model
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text(); // Await the response text

        // console.log("Generated Content:", text);
        return text
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return 'Error generating response. Please try again later.';
    }
}

// Function to get chatbot response and store it in local storage
export async function getChatBotResponse(userId, reqId, query) {
    const conversationHistory = getConversationHistory(userId, reqId).map(entry => `User: ${entry.user}\nBot: ${entry.bot}`).join('\n');
    const prompt = `Send the response in html body format only: ${conversationHistory}\nUser: ${query}\nBot:`;

    const botResponse = await callGeminiAPI(prompt);

    if (botResponse) {
        storeInLocalStorage(userId, reqId, query, botResponse);
    }

    return botResponse;
}

// Function to get Mermaid code by summarizing the conversation history
export async function getMermaidCode(userId, reqId) {
    const conversationHistory = getConversationHistory(userId, reqId);

    if (conversationHistory.length === 0) {
        return 'No conversation history found.';
    }

    // Summarize conversation using Gemini
    const summaryPrompt = `Summarize the following conversation: ${JSON.stringify(conversationHistory)}`;
    const summary = await callGeminiAPI(summaryPrompt);

    // Refined prompt for generating Excalidraw elements array
    const mermaidPrompt = `
    Convert the following summary into a Mermaid code version 11.0.2, only send as response the mermaid code with no other explanation, it should be a working code. try the keep the diagram very short and simple and always keep the syntax right, don't use paranthesis. Here is the summary to convert: ${summary}`;
    
    const mermaidCode = await callGeminiAPI(mermaidPrompt);

    // Clear conversation history after generating Mermaid code
    // clearConversationHistory(userId, reqId);

    return mermaidCode;
}