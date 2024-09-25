'use client';
import React, { useState, useContext } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Chatbox from '@/components/Chatbox';
import { AppContext } from '@/components/context';

export default function ExcalidrawWrapper() {
  const { changeChart, currentProject } = useContext(AppContext)
  const [openChat, setOpenChat] = useState(true);
  const [isLoading, setIsLoading] = useState(false);


  return (
    <>
        <div className="relative h-screen max-h-[95vh] sm:min-h-screen w-screen sm:max-w-[95vw] md:max-w-[95vw] lg:max-w-[95vw] xl:max-w-[95vw] 2xl:max-w-[97vw] 3xl:max-w-[98vw]">

            <Excalidraw
              initialData={{
                elements: currentProject?.elements,
                appState: { zenModeEnabled: false },
                scrollToContent: true,
              }}
              key={currentProject?.mermaid}
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
              <Chatbox setIsLoading={setIsLoading} isLoading={isLoading} setChart={changeChart} project={currentProject} />
            </div>
          )}
        </div>
    </>
  );
}