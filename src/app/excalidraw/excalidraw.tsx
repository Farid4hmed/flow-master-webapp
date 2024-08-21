'use client'
import { Excalidraw } from "@excalidraw/excalidraw";

export default function ExcalidrawWrapper() {

    return (
        <section className="h-full w-full">
            <div className="w-screen h-screen">
                <Excalidraw />
            </div>
        </section>
    )
}