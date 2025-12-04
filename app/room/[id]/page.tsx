import { ROOMS } from '@/config/rooms';
import { redirect } from 'next/navigation';
import RoomManagerClient from '@/components/Room/RoomManagerClient';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string; avatar?: string }>;
}

export default async function RoomPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { name, avatar } = await searchParams;

  // Fix: Decode URL params (e.g. "cyberpunk%20bar" -> "cyberpunk bar")
  const roomId = decodeURIComponent(id);

  // Debug: Watch your TERMINAL for these logs
  console.log(`------------------------------------------------`);
  console.log(`[RoomPage] Visiting Room ID: "${roomId}"`);
  console.log(`[RoomPage] Available Room IDs:`, ROOMS.map(r => r.id));
  console.log(`------------------------------------------------`);

  const roomConfig = ROOMS.find(r => r.id === roomId);
  
  if (!roomConfig) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold text-red-500">404: Room Not Found</h1>
        <div className="text-gray-400 text-center">
          <p>We looked for ID: <strong>&quot;{roomId}&quot;</strong></p>
          <p className="text-sm mt-2 text-gray-600">
            Make sure this ID matches one in your <code>config/rooms.ts</code> file.
          </p>
        </div>
      </div>
    );
  }

  if (!name || !avatar) {
    redirect('/');
  }

  return <RoomManagerClient room={roomConfig} username={name} avatar={avatar} />;
}

