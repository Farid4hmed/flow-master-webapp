import { getServerSession } from "next-auth";
import { SidebarWrapper } from '@/components/Sidebar';
import { authOptions } from "./api/auth/[...nextauth]/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions)
  return (

    <main className="w-screen h-screen flex flex-row overflow-hidden">
        <SidebarWrapper session={session} />
    </main>

  );
}