import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });



async function callGeminiAPI(prompt) {
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        return text
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return 'Error generating response. Please try again later.';
    }
}

export async function getChatBotResponse(query, userId, projectId) {
    // const conversationHistory = prompts.map(entry => `User: ${entry.user}\nBot: ${entry.bot}`).join('\n');
    // const prompt = `Respond to users latest message, keep the response short, Send response in HTML (don't add html at the front of the text): ${conversationHistory}\nUser: ${query}\nBot:`;
    // const myUUID = uuidv4();
    const payload = {
        userID: `${userId}`,
        requestID: `${projectId}`,
        user_input: query
    }


    const botResponse = await axios.post(`https://fab-team-services.xyz/chat-llm/`, payload, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(botResponse.data)return botResponse?.data;
    else return null
}



export async function getMermaidCode(userId, projectId) {
    const payload = {
        userID: `${userId}`,
        requestID: `${projectId}`,
    }

    try {
        const botResponse = await axios.post(`https://fab-team-services.xyz/generate-mermaid/`, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        
        // let resultMermaid;
        // if (botResponse.data) {
        //     resultMermaid = botResponse.data?.mermaid_code;
        // }
        // const validatedMermaidCode = await callGeminiAPI(`Make this Mermaid code working for version 11.2.1, only send the mermaid code as response: ${resultMermaid}`);
        return botResponse.data?.mermaid_code;

    } catch (error) {
        console.error("Error fetching mermaid code:", error);
        return null; // Optionally, return null or handle the error as needed
    }
}

export async function getProjectTitle(prompts, userId, requestId) {
    try {
        const payload = {
            userID: `${userId}`,  // Ensure this is a string
            requestID: requestId,  // Ensure this is also a string
            user_input: prompts  // This should be an array of objects as you defined
        };

        const result = await axios.post('https://fab-team-services.xyz/generate-summary-title/', payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (result.data) {
            return result.data?.project_title;
        }

        return null;
    } catch (error) {
        console.error('Error generating project title:', error.message);
        throw new Error('Failed to generate project title. Please try again.');
    }
}