import { ROOMS } from '@/config/rooms';
import { redirect } from 'next/navigation';
import RoomManagerWrapper from '@/components/Room/RoomManagerWrapper';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string; avatar?: string; key?: string }>; 
}

export default async function RoomPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { name, avatar, key } = await searchParams; 

  const roomId = decodeURIComponent(id);

  const roomConfig = ROOMS.find(r => r.id === roomId);
  
  if (!roomConfig) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-bold text-red-500">404: Room Not Found</h1>
        <div className="text-gray-400 text-center">
          <p>Room ID <strong>&quot;{roomId}&quot;</strong> does not exist.</p>
        </div>
      </div>
    );
  }

  // SECURITY CHECK
  if (roomConfig.password && key !== roomConfig.password) {
    redirect('/');
  }

  if (!name || !avatar) {
    redirect('/');
  }

  // Use the Client Wrapper instead of the component directly
  return <RoomManagerWrapper room={roomConfig} username={name} avatar={avatar} />;
}