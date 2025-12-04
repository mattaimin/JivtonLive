
import { RoomConfig } from "@/types";

export const ROOMS: RoomConfig[] = [
  {
    id: 'cyberpunk-bar',
    name: "霓虹酒馆 🍸",
    description: "灯红酒绿，来玩大话骰。",
    password: "2077",
    maxSeats: 2,
    game: 'liars-dice',
    theme: {
      // New Cyberpunk/Neon Bar Image
      backgroundUrl: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1740&auto=format&fit=crop", 
      // Bar Ambience Audio (Crowd noise, glasses clinking)
      audioUrl: "/sounds/lounge-bar.mp3", 
      primaryColor: "#00f3ff", 
      accentColor: "#ff0055",
    }
  }
];

export const AVATARS = [
  "🤖", "👽", "🦊", "🐯", "🕶️", "🕵️‍♂️", "👩‍🎤", "👨‍🚀"
];