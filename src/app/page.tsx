import dynamic from 'next/dynamic';
import Navigation from "@/components/Navigation";
import { getServerSession } from "next-auth";
import { SidebarWrapper } from '@/components/Sidebar';

const AppWrapper = dynamic(() => import('./excalidraw/appWrapper'), { ssr: false });

export default async function Home() {
  const session = await getServerSession()
  return (

    <main className="w-screen h-screen flex flex-row overflow-hidden">
      {/* <Navigation session={session}> */}
        <SidebarWrapper />
      {/* </Navigation> */}
    </main>

  );
}