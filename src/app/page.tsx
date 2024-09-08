// import dynamic from 'next/dynamic';
import { getServerSession } from "next-auth";
import { SidebarWrapper } from '@/components/Sidebar';
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
// const AppWrapper = dynamic(() => import('./excalidraw/appWrapper'), { ssr: false });

export default async function Home() {
  const session = await getServerSession(authOptions)
  return (

    <main className="w-screen h-screen flex flex-row overflow-hidden">
      {/* <Navigation session={session}> */}
        <SidebarWrapper session={session} />
      {/* </Navigation> */}
    </main>

  );
}