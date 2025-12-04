'use client'

import dynamic from 'next/dynamic';
import { RoomConfig } from '@/types';

const RoomManager = dynamic(
  () => import('./RoomManager'), 
  { ssr: false }
);

interface Props {
  room: RoomConfig;
  username: string;
  avatar: string;
}

export default function RoomManagerClient({ room, username, avatar }: Props) {
  return <RoomManager room={room} username={username} avatar={avatar} />;
}

