'use client';
import React, { useState, useLayoutEffect } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import mermaidToExcalidrawElements from './mermaidToExcali';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, CircleArrowRight } from 'lucide-react';
import Chatbox from '@/components/Chatbox';

export default function ExcalidrawWrapper(props: any) {

  const [elements, setElements] = useState([]);
  const [openChat, setOpenChat] = useState(true);
  const [isLoading, setIsLoading] = useState(false);


  useLayoutEffect(() => {
    const convertMermaidToElements = async (code: any) => {
      try {
        console.log("Code going in");
        const result: any = await mermaidToExcalidrawElements(code);
        console.log("Result getting out ", result);
        setElements(result);
      } catch (error) {
        console.error("Error converting Mermaid to Excalidraw elements:", error);
        setElements([]);
      }
    };

    if (props.chart) {
      convertMermaidToElements(props.chart);
    } else {
      // Handle cases where the props.chart is not available
      convertMermaidToElements(`graph TD
        A["Couldn't Generate Diagram, Please Try Regenerating"]
      `);
    }

  }, [props.chart]); // Dependency on props.chart

  console.log("elements\n", elements);

  return (
    <>
      {/* {isLoading ? (
        <div className="w-auto h-screen bg-gray-100 flex justify-center items-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-success motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status">
            <span
              className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
            >Loading...</span>
          </div>
        </div>
      ) : ( */}
      <div className="relative h-screen max-h-[95vh] sm:min-h-screen w-screen sm:max-w-[95vw] md:max-w-[95vw] lg:max-w-[95vw] xl:max-w-[95vw] 2xl:max-w-[97vw] 3xl:max-w-[98vw]">
        <Excalidraw
          initialData={{
            elements,
            appState: { zenModeEnabled: false },
            scrollToContent: true,
          }}
          key={props.chart}
        />

        <div
          className="absolute lg:top-0 max-h-max max-w-max lg:left-16 bottom-16 right-0 m-3 z-20 cursor-pointer rounded-md rounded-b-none"
          onClick={() => setOpenChat(!openChat)}
        >
          <Avatar>
            <AvatarImage src="/chat.png" />
            <AvatarFallback>Chat</AvatarFallback>
          </Avatar>
        </div>
        {openChat && (
          <div className="absolute lg:top-5 lg:left-[5.1rem] bottom-28 right-4 m-3 z-10 shadow-lg lg:w-2/6 2xl:w-1/5 lg:h-2/3 w-11/12 h-4/6 2xl:h-1/2 bg-white rounded-2xl rounded-tl-none">
            <Chatbox setIsLoading={setIsLoading} isLoading={isLoading} setChart={props.setChart} />
          </div>
        )}
      </div>
    </>
  );
}