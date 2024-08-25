import Chatbox from "@/components/Chatbox";
import ExcalidrawWrapper from "./excalidraw";
import { SidebarWrapper } from "@/components/Sidebar";


export default async function Home() {
    return (
        <main className="w-screen h-screen">
            <SidebarWrapper />
        </main>
    );
}