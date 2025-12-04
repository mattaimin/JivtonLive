export type RoomId = 'cyberpunk-bar' | 'cozy-campfire';

export interface RoomConfig {
  id: RoomId;
  name: string;
  description: string;
  password?: string; // Optional password protection
  theme: {
    backgroundUrl: string; // URL for the room background
    audioUrl: string;      // URL for the background ambience
    primaryColor: string;  // Neon accents
    accentColor: string;
  };
  maxSeats: number;
  game: 'liars-dice' | 'none';
}

export interface UserIdentity {
  username: string;
  avatar: string; // Emoji or Image URL
}