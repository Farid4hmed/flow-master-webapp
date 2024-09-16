'use client'
import React from "react";
import dynamic from 'next/dynamic';


const ExcalidrawWrapper = dynamic(() => import('./excalidraw'), {
    ssr: false, 
});

export default function AppWrapper() {


    return (
        <section className="w-screen max-w-screen h-screen flex flex-row relative">


            <div className="flex-1 h-full">
                <ExcalidrawWrapper />
            </div>
        </section>
    );
}