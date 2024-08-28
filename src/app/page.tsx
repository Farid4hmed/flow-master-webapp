import dynamic from 'next/dynamic';

const AppWrapper = dynamic(() => import('./excalidraw/appWrapper'), { ssr: false });

export default function Home() {
  return (
    <main className="w-screen h-screen flex flex-row">
      <AppWrapper />
    </main>
  );
}