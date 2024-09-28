"use client"
import React, { useState, useEffect, useRef, useContext } from "react";
import Form from "./form";
import { v4 as uuidv4 } from 'uuid';
import { getChatBotResponse, getMermaidCode } from "../app/api/chatbot";
import { CircleArrowRight } from 'lucide-react';
import { ReloadIcon } from "@radix-ui/react-icons"
import { AppContext } from "./context";
import { Button } from "@/components/ui/button"
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Chatbox: any = (props: any) => {
  const { prompts, addPrompt, updatePrompt, clearChat, currentProject, projects } = useContext(AppContext);

  const [submitted, setSubmitted] = useState(false);
  const [isFetchingResponse, setIsFetchingResponse] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");

  const handleSubmit = async (query: string) => {
    const textId = uuidv4();

    const newPrompt = {
      id: textId,
      text: query,
      response: "..."
    };

    addPrompt(newPrompt);
    setSubmitted(true);
    setIsFetchingResponse(true);
    const chatBotResp = await getChatBotResponse(query, currentProject?.userId, currentProject?.id);

    updatePrompt(textId, { response: chatBotResp?.model_output })

    if (chatBotResp?.wantsToDraw) getMermaidCodeResponse();

    setIsFetchingResponse(false);
  }

  const getMermaidCodeResponse = async () => {
    props.setIsLoading(true);
    let response = await getMermaidCode(currentProject?.userId, currentProject?.id);

    let mermaidCode = response;
    mermaidCode = cleanMermaidInput(mermaidCode);


    props.setChart(mermaidCode, props.project?.id || '0');
    props.setIsLoading(false);
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
    if (prompts) setSubmitted(prompts.length > 0)

  }, [prompts]);

  return (
    <div className="flex justify-center items-center h-full w-full rounded-xl shadow-xl m-0">
      <div className="flex flex-col items-start sm:px-10 px-4 text-left justify-start sm:pt-8 pt-4 2xl:px-8 h-full w-full bg-gray-200 relative no-scrollbar rounded-2xl rounded-tl-4xl">
        {prompts && prompts.length > 0 && (
          <div className="absolute top-3 md:top-4 left-9 text-gray-500">
            <button className="bg-none text-xs underline" onClick={clearChat}>
              Clear Chat
            </button>
          </div>
        )}
        <div ref={chatContainerRef} className="w-full pt-4 no-scrollbar" style={{ maxHeight: 'calc(70%)', transition: 'all 0.5s ease', overflowY: submitted ? "scroll" : "hidden", scrollbarWidth: "none" }}>
          {submitted && (
            <section className="flex flex-col space-y-4">
              {prompts && Array.isArray(prompts) && prompts.map((prompt) => (
                <div key={prompt.id} className="flex flex-col space-y-5 pb-14 sm:pb-6">
                  <div className="bg-gray-100 p-4 text-sm rounded-lg rounded-tr-none shadow-md self-end text-left break-words ml-auto max-w-[90%]">
                    <strong className="text-green-500">You:</strong> {prompt.text}
                  </div>
                  {prompt.response && (
                    <div className="bg-gray-100 p-4 text-sm rounded-lg rounded-tl-none shadow-md self-start text-left break-words mr-auto max-w-[90%]">
                      <strong className="text-purple-600">Bot:</strong>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                      >{prompt.response.replace(/\n{2,}/g, '\n') // replace \n\n with \n
                        .replace(/\n\*/g, '\n') // replace \n* with \n*
                        .replace(/\n/g, '\n')}</ReactMarkdown>
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
        <div className="w-full absolute bottom-0 left-0">
          <Form onSubmit={handleSubmit} disabled={isFetchingResponse} query={query} setQuery={setQuery} />
          {!isFetchingResponse && prompts && prompts.length >= 1 &&
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


          {!submitted && query.length == 0 && prompts && prompts.length == 0 && (
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}




export default Chatbox;