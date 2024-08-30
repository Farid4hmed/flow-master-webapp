'use client';
import React, { useState, useLayoutEffect } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import mermaidToExcalidrawElements from './mermaidToExcali';

export default function ExcalidrawWrapper(props: any) {
  const [elements, setElements] = useState([]);

  useLayoutEffect(() => {
    const convertMermaidToElements = async (code: any) => {
      try {
        const result: any = await mermaidToExcalidrawElements(code);
        setElements(result);
      } catch (error) {
        console.error("Error converting Mermaid to Excalidraw elements:", error);
        setElements([]);
      }
    };

    if (props.chart) {
      convertMermaidToElements(props.chart);
    } else {
      // Handle cases where the chart is not available
      convertMermaidToElements(`graph TD
        A["Couldn't Generate Diagram, Please Try Regenerating"]
      `);
    }

  }, [props.chart]); // Dependency on props.chart

  console.log("chart\n", elements);

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
      ) : (
        <div className="h-screen w-screen">
          <div className="w-3/5 2xl:w-3/4 h-screen">
          {elements && 
            <Excalidraw
              initialData={{
                elements,
                appState: { zenModeEnabled: false },
                scrollToContent: true,
              }}
              key={props.chart}
            />
        }
          </div>
        </div>
      )}
    </>
  );
}