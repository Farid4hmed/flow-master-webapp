"use client"
import React, { useState, useEffect, useRef, useContext } from "react";
import Form from "./form";
import { v4 as uuidv4 } from 'uuid';
import { getChatBotResponse, getMermaidCode } from "../app/api/chatbot";
import { Bot, CircleArrowRight } from 'lucide-react';
import { ReloadIcon } from "@radix-ui/react-icons"
import { AppContext } from "./context";
import { Button } from "@/components/ui/button"

const generateUUID = () => {
  const newId = uuidv4();
  return newId;
};

const predefinedConversation = [
  {
    user_input: "Can you help me with a system design solution for a software?",
    model_output: "Sure, can you provide more details about the software you need the design solution for?",
  },
  {
    user_input: "It's a social media platform where users can post updates and follow others.",
    model_output: "Got it. Do you have a specific tech stack in mind for this platform?",
  },
  {
    user_input: "I was thinking of using MERN stack for the development.",
    model_output: "Great choice! How many users are you expecting to handle initially and in the future?",
  },
  {
    user_input: "Initially, around 10,000 users, but we want to scale to millions eventually.",
    model_output: "Understood. Do you have any preferences for the database and storage solutions?",
  },
  {
    user_input: "I was considering MongoDB for the database and AWS S3 for storage.",
    model_output: "Perfect. Would you like to discuss the architecture now or focus on specific components?",
  }
];

const getMockChatBotResponse = async (userId: string, reqId: string, query: string) => {
  const prompt = predefinedConversation.find((conv) => conv.user_input === query);
  return new Promise<{ user_input: string, model_output: string, wantsToDraw: boolean }>((resolve) => {
    setTimeout(() => {
      if (prompt) {
        resolve({
          user_input: prompt.user_input,
          model_output: prompt.model_output,
          wantsToDraw: false
        });
      } else {
        resolve({
          user_input: query,
          model_output: "I'm sorry, I don't have a response for that.",
          wantsToDraw: false
        });
      }
    }, 1000);
  });
};

const getMockMermaidCode = async () => {
  return `
graph TD
    A[User] -->|Posts Updates| B[Web/Mobile App]
    B --> C[Backend Server]
    C --> D[API Gateway]
    D --> E[Authentication Service]
    D --> F[Post Service]
    D --> G[User Service]
    D --> H[Notification Service]
    D --> I[Follow Service]
    
    F -->|Stores Data| J[MongoDB Database]
    G -->|Stores Data| J[MongoDB Database]
    I -->|Stores Data| J[MongoDB Database]
    
    F -->|Stores Media| K[AWS S3 Storage]
    
    E --> L[Auth Database]
    
    C --> M[Load Balancer]
    M --> N[Web Servers]
    M --> O[Cache]
    
    subgraph User Interactions
        B
    end
    
    subgraph Services
        E
        F
        G
        H
        I
    end
    
    subgraph Databases
        J
        L
    end
    
    subgraph Infrastructure
        M
        N
        O
    end

`
}

const Chatbox: any = (props: any) => {
  // let setChart = props.setChart;
  const { prompts, addPrompt, updatePrompt } = useContext(AppContext);
  let newId = generateUUID();
  let newReqId = generateUUID();
  const [count, setCount] = useState(0);
  // const [chart, setChart] = useState('');
  const [submitted, setSubmitted] = useState(prompts.length > 0);
  const [userId, setUserId] = useState(newId);
  const [reqId, setReqId] = useState(newReqId);
  // const [prompts, setPrompts] = useState<{ id: string; text: string; response: string; }[]>([]);
  const [isFetchingResponse, setIsFetchingResponse] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isFetchingMermaidCode, setIsFetchingMermaidCode] = useState(false);
  const [query, setQuery] = useState("");

  const handleSubmit = async (query: string) => {
    const textId = uuidv4();

    const newPrompt = {
      id: textId,
      text: query,
      response: "<em>...</em>"
    };

    addPrompt(newPrompt);
    setSubmitted(true);
    setIsFetchingResponse(true);

    const chatBotResp = await getChatBotResponse(userId, reqId, query);
    const wantsToDraw = false;

    if (wantsToDraw) {
      getMermaidCodeResponse();
    } else {
    }

    updatePrompt(textId, { response: chatBotResp })

    setIsFetchingResponse(false);
  };

  const getMermaidCodeResponse = async () => {
    console.log("getMermaidCodeResponse")
    props.setIsLoading(true);
    // setIsFetchingMermaidCode(true)

    let response = await getMermaidCode(userId, reqId);

    let mermaidCode = response;
    mermaidCode = cleanMermaidInput(mermaidCode);


    // mermaidCode = mermaidCode.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\'/g, "'");
    props.setChart(mermaidCode);
    props.setIsLoading(false);
    // setPrompts([]);
    // setIsFetchingMermaidCode(false);
  }
  function cleanMermaidInput(input: any) {
    return input.replace(/^```mermaid\s*/, '').replace(/```$/, '').trim();
  }
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }

    
  }, [prompts]);

  console.log("ISLOADING ->  ", props.isLoading)
  return (
    <div className="flex justify-center items-center h-full w-full rounded-xl shadow-xl m-0">
      {/* chatbot */}
      <div className="flex flex-col items-start sm:px-10 px-4 text-left justify-start sm:pt-8 pt-4 2xl:px-10 h-full w-full bg-gray-200 relative no-scrollbar rounded-2xl rounded-tl-4xl">
        {/* <img src="/chat-bot.png" className="float-start h-10 w-10" /> */}
        <div ref={chatContainerRef} className="w-full pt-4 no-scrollbar" style={{ maxHeight: 'calc(70%)', transition: 'all 0.5s ease', overflowY: submitted ? "scroll" : "hidden", scrollbarWidth: "none" }}>
          {/* {!submitted && (
            <div className="grid grid-cols-2 sm:mt-20 md:mt-40 gap-4">
              <button className="h-20 text-center hover:pointer hover:bg-gray-100 shadow-md hover:shadow-lg border border-gray-400 rounded flex items-center justify-center transition-shadow duration-300"
                onClick={() => handleSubmit(`Design the cloud architecture for a Real-Time Data Analytics Platform`)}
              >
                <p className="text-xs text-gray-500">Design the cloud architecture for a Real-Time Data Analytics Platform</p>
              </button>
              <button className="h-20 text-center hover:pointer hover:bg-gray-100 shadow-md hover:shadow-lg border border-gray-400 rounded flex items-center justify-center transition-shadow duration-300"
                onClick={() => handleSubmit(`Create a component diagram for a Microservices-based E-commerce Application`)}
              >
                <p className="text-xs text-gray-500">Create a component diagram for a Microservices-based E-commerce Application</p>
              </button>
              <button className="h-20 text-center hover:pointer hover:bg-gray-100 shadow-md hover:shadow-lg border border-gray-400 rounded flex items-center justify-center transition-shadow duration-300"
                onClick={() => handleSubmit(`Provide a sequence diagram for a Serverless Event-Driven Workflow`)}
              >
                <p className="text-xs text-gray-500">Provide a sequence diagram for a Serverless Event-Driven Workflow</p>
              </button>
              <button className="h-20 text-center hover:pointer hover:bg-gray-100 shadow-md hover:shadow-lg border border-gray-400 rounded flex items-center justify-center transition-shadow duration-300"
                onClick={() => handleSubmit(`Give me a design for a Scalable API Gateway`)}
              >
                <p className="text-xs text-gray-500">Give me a design for a Scalable API Gateway</p>
              </button>
            </div>
          )} */}
          {submitted && (
            <section className="flex flex-col space-y-4">
              {prompts.map((prompt) => (
                <div key={prompt.id} className="flex flex-col space-y-5 pb-14 sm:pb-6">
                  <div className="bg-gray-100 p-4 text-sm rounded-lg rounded-tr-none shadow-md self-end text-left break-words ml-auto max-w-[70%]">
                    <strong className="text-green-500">You:</strong> {prompt.text}
                  </div>
                  {prompt.response && (
                    <div className="bg-gray-100 p-4 text-sm rounded-lg rounded-tl-none shadow-md self-start text-left break-words mr-auto max-w-[70%]">
                      <strong className="text-purple-600">Bot:</strong> <div
                        dangerouslySetInnerHTML={{ __html: prompt.response }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
        <div className="w-full absolute bottom-0 left-0">
          <Form onSubmit={handleSubmit} disabled={isFetchingResponse} query={query} setQuery={setQuery} />
          {!isFetchingResponse && prompts.length >= 1 &&
            (<div className="w-full flex justify-center items-center sm:mb-3 mb-2 mt-0">
              {!props.isLoading ? <Button
                className="bg-green-500 hover:bg-green-700"
                onClick={() => getMermaidCodeResponse()}
              >
                Generate Solution
                <CircleArrowRight size={24} color="#feffff" className="ml-3" />
              </Button>
                :
                <Button disabled>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin text-white" />
                  Generating Solution...
                </Button>
              }
            </div>)
          }
          {!submitted && query.length == 0 && prompts.length == 0 && (
            <div className="w-full flex justify-center items-center pt-2">
              <div className="grid grid-cols-2 sm:mt-5 mt-1 md:-mt-4 sm:mb-5 mb-2 gap-4 w-3/4">
                <button
                  className="h-10 text-center hover:pointer hover:bg-gray-100 shadow-md hover:shadow-lg border border-gray-400 rounded flex items-center justify-center transition-shadow duration-300"
                  onClick={() =>
                    setQuery(
                      `Design a Cloud Architecture`
                    )
                  }
                >
                  <p className="text-xs text-gray-500">Cloud Architecture</p>
                </button>
                <button
                  className="h-10 text-center hover:pointer hover:bg-gray-100 shadow-md hover:shadow-lg border border-gray-400 rounded flex items-center justify-center transition-shadow duration-300"
                  onClick={() =>
                    setQuery(
                      `Create a Flow Chart`
                    )
                  }
                >
                  <p className="text-xs text-gray-500">Flow Chart</p>
                </button>
                {/* <button
                  className="h-10 text-center hover:pointer hover:bg-gray-100 shadow-md hover:shadow-lg border border-gray-400 rounded flex items-center justify-center transition-shadow duration-300"
                  onClick={() =>
                    setQuery(
                      `Provide a Sequence Diagram`
                    )
                  }
                >
                  <p className="text-xs text-gray-500">Sequence</p>
                </button>
                <button
                  className="h-10 text-center hover:pointer hover:bg-gray-100 shadow-md hover:shadow-lg border border-gray-400 rounded flex items-center justify-center transition-shadow duration-300"
                  onClick={() =>
                    setQuery(`Design an ER Diagram`)
                  }
                >
                  <p className="text-xs text-gray-500">ER Diagram</p>
                </button> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};




export default Chatbox;