'use client'
import React, { useEffect, useState } from "react";
import Chatbox from "@/components/Chatbox";
import ExcalidrawWrapper from "./excalidraw";
// import { SidebarWrapper } from "@/components/Sidebar";


export default function AppWrapper() {
    const [chart, setChart] = useState(``);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        localStorage.clear();
    }, []);
    return (
        <section className="w-screen h-screen flex flex-row">
            <div className="w-2/5 2xl:w-2/4 h-full">
                <Chatbox setChart={setChart} setIsLoading={setIsLoading} />
            </div>
            <div className="w-3/5 2xl:w-3/4 h-full">
                <ExcalidrawWrapper chart={chart} isLoading={isLoading} />
            </div>
        </section>
    );
}