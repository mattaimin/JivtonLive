'use client'

import dynamic from 'next/dynamic';
import { RoomConfig } from '@/types';

// Dynamically import the RoomManager with SSR disabled.
// This works here because this file is a Client Component ('use client').
const RoomManager = dynamic(
  () => import('./RoomManager'), 
  { ssr: false }
);

interface Props {
  room: RoomConfig;
  username: string;
  avatar: string;
}

export default function RoomManagerWrapper(props: Props) {
  return <RoomManager {...props} />;
}