import dynamic from 'next/dynamic';
import Navigation from "@/components/Navigation";
import { getServerSession } from "next-auth";

const AppWrapper = dynamic(() => import('./excalidraw/appWrapper'), { ssr: false });

export default async function Home() {
  const session = await getServerSession()
  return (

    <main className="w-screen h-screen flex flex-row overflow-hidden">
      <Navigation session={session}>
        <AppWrapper />
      </Navigation>
    </main>

  );
}