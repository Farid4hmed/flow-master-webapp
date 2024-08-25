'use client'
import React, { useState, useEffect } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import mermaidToExcalidrawElements from './mermaidToExcali';

const mermaidSyntax = `flowchart TD
  A[Christmas] -->|Get money| B(Go shopping)
  B --> C{Let me think}
  C -->|One| D[Laptop]
  C -->|Two| E[iPhone]
  C -->|Three| F[Car]`;

export default function ExcalidrawWrapper() {
    const [elements, setElements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const convertMermaidToElements = async () => {
            const result: any = await mermaidToExcalidrawElements(mermaidSyntax);
            setElements(result);
            setIsLoading(false);  // Set loading to false once elements are available
        };

        convertMermaidToElements();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; // Display a loading indicator or placeholder
    }

    return (
        <section className="h-screen w-screen">
            <div className="w-3/4 h-screen">
                <Excalidraw
                    initialData={{
                        elements,
                        appState: { zenModeEnabled: true },
                        scrollToContent: true

                    }}
                />
            </div>
        </section>
    );
}