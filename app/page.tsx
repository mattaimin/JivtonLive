'use client'

import { useState } from 'react';
import { ROOMS } from '@/config/rooms';
import { RoomConfig } from '@/types';
import JoinModal from '@/components/Lobby/JoinModal';
import { t } from '@/utils/i18n';

export default function Home() {
  const [selectedRoom, setSelectedRoom] = useState<RoomConfig | null>(null);

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden selection:bg-cyan-500 selection:text-black">
      
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/30 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-900/20 rounded-full blur-[128px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-10">
        <header className="mb-16 text-center">
          <h1 className="text-6xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
            {t.titlePart1}<span className="text-white">{t.titlePart2}</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-lg mx-auto">
            {t.subtitle}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ROOMS.map((room) => (
            <div 
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-white/30 transition-all hover:-translate-y-1"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${room.theme.backgroundUrl})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                      {room.name}
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-1">
                      {room.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      {room.game === 'liars-dice' ? '🎲' : '🎤'}
                    </span>
                  </div>
                </div>
              </div>

              {room.password && (
                <div className="absolute top-4 right-4 bg-black/60 p-2 rounded-full backdrop-blur-md flex items-center gap-1 px-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest">{t.locked}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-white/70">
                    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedRoom && (
        <JoinModal 
          room={selectedRoom} 
          onClose={() => setSelectedRoom(null)} 
        />
      )}

    </main>
  );
}