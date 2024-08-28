'use client';
import React, { useState, useEffect } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import mermaidToExcalidrawElements from './mermaidToExcali';

export default function ExcalidrawWrapper(props: any) {
  const [elements, setElements] = useState([]);
  console.log("chart\n", elements)
  useEffect(() => {
    const convertMermaidToElements = async (code: any) => {
      const result: any = await mermaidToExcalidrawElements(code);
      setElements(result);
    };

    convertMermaidToElements(props.chart);

    if (!elements) {
      convertMermaidToElements(props.chart);
    }

  }, [props.chart]);

  // if (props.isLoading) {
  //   return <div className="w-full h-full bg-gray-100 flex justify-center items-center">
  //     <div
  //       className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-success motion-reduce:animate-[spin_1.5s_linear_infinite]"
  //       role="status">
  //       <span
  //         className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
  //       >Loading...</span>
  //     </div>
  //   </div>;
  // }

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
            <div className="w-3/5 2xl:w-3/4 h-screen">
              <Excalidraw
                initialData={{
                  elements,
                  appState: { zenModeEnabled: false },
                  scrollToContent: true,
                }}
                key={props.chart}
              />
            </div>
          </div>
        )}

    </>
  );
}