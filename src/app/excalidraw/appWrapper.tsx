'use client'
import React from "react";
import ExcalidrawWrapper from "./excalidraw";

export default function AppWrapper() {


    return (
        <section className="w-screen max-w-screen h-screen flex flex-row relative">


            <div className="flex-1 h-full">
                    <ExcalidrawWrapper  />
            </div>
        </section>
    );
}