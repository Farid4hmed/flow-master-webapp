import { GoogleGenerativeAI } from "@google/generative-ai";


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

export async function getChatBotResponse(prompts, query) {
    const conversationHistory = prompts.map(entry => `User: ${entry.user}\nBot: ${entry.bot}`).join('\n');
    const prompt = `Respond to users latest message, keep the response short, Send response in HTML (don't add html at the front of the text): ${conversationHistory}\nUser: ${query}\nBot:`;

    const botResponse = await callGeminiAPI(prompt);

    return botResponse;
}

export async function getMermaidCode(prompts) {
    console.log("getMermaidCode")
    const conversationHistory = prompts

    if (conversationHistory.length === 0) {
        return 'No conversation history found.';
    }

    const summaryPrompt = `Summarize the following conversation: ${JSON.stringify(conversationHistory)}`;
    const summary = await callGeminiAPI(summaryPrompt);

    const mermaidPrompt = `
    Given is a summary of a conversation betweeen user and a bot, your task is to generate a mermaid code version 11.0.2 according what user wants to build ( The use of square brackets ([" "]) around the subgraph names allows for spaces in the names.), only send as response the mermaid code with no other explanation, it should be a working code. try the keep the diagram very short and simple and always keep the syntax right, don't use paranthesis. Here is the summary to convert: ${summary}`;
    
    const mermaidCode = await callGeminiAPI(mermaidPrompt);

    const validatedMermaidCode = await callGeminiAPI(`Fix Syntax Error on the Mermaid code version 11.0.2, only send the mermaid code as response: ${mermaidCode}`);

    return validatedMermaidCode;
}