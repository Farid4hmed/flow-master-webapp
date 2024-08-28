'use client';
import React, { useState, useEffect } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import mermaidToExcalidrawElements from './mermaidToExcali';

export default function ExcalidrawWrapper(props: any) {
  const [elements, setElements] = useState([]); // State to store Excalidraw elements
  console.log("chart\n", props.chart)
  useEffect(() => {
    const convertMermaidToElements = async () => {
      const result: any = await mermaidToExcalidrawElements(props.chart); // Convert the mermaid chart to Excalidraw elements
      setElements(result); // Set the resulting elements
    };

    convertMermaidToElements(); // Call the function whenever props.chart changes
  }, [props.chart]); // Dependency array ensures this effect runs whenever props.chart changes

  // Show a loading indicator while loading
  if (props.isLoading) {
    return <div className="w-full h-full bg-gray-100 flex justify-center items-center">
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-success motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status">
        <span
          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
        >Loading...</span>
      </div>
    </div>;
  }

  return (
    <>
      {props.isLoading ? (
        <div className="w-full h-full bg-gray-100 flex justify-center items-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-success motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status">
            <span
              className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
            >Loading...</span>
          </div>
        </div>
      ) :
        (
          <div className="h-screen w-screen">
            <div className="w-3/5 h-screen">
              <Excalidraw
                initialData={{
                  elements, // Dynamically set elements
                  appState: { zenModeEnabled: true }, // Application state for Excalidraw
                  scrollToContent: true, // Auto-scroll to content
                }}
                key={props.chart} // Use a key to force re-render Excalidraw component on data change
              />
            </div>
          </div>
        )}

    </>
  );
}