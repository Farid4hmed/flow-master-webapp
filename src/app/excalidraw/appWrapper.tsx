'use client'
import React, { useContext, useEffect, useState } from "react";
import Chatbox from "@/components/Chatbox";
import ExcalidrawWrapper from "./excalidraw";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, CircleArrowRight } from 'lucide-react';
import { AppContext } from "@/components/context";

export default function AppWrapper() {
    const {chart, changeChart } = useContext(AppContext);

    // useEffect(() => {
    //     localStorage.clear();
    // }, []);

    return (
        <section className="w-screen max-w-screen h-screen flex flex-row relative">
            {/* Your other components */}


            {/* ExcalidrawWrapper to take the remaining width */}
            <div className="flex-1 h-full">

                <ExcalidrawWrapper chart={chart} setChart={changeChart} />
            </div>
        </section>
    );
}