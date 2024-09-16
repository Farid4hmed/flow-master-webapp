import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
import Chatbox from "./Chatbox"
import ExcalidrawWrapper from "./excalidraw/excalidraw"
  
  export function Resizable() {
    return (
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[200px] max-w-screen rounded-lg border md:min-w-[450px]"
      >
        <ResizablePanel defaultSize={25}>
          <Chatbox />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <ExcalidrawWrapper />
        </ResizablePanel>
      </ResizablePanelGroup>
    )
  }
  