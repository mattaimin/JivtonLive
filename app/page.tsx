'use client'

import { useState } from 'react';
import { ROOMS } from '@/config/rooms';
import { RoomConfig } from '@/types';
import JoinModal from '@/components/Lobby/JoinModal';
import { t } from '@/utils/i18n';

export default function Home() {
  const [selectedRoom, setSelectedRoom] = useState<RoomConfig | null>(null);

  return (
    <main className="min-h-screen bg-[#050505] text-white relative overflow-hidden selection:bg-cyan-500 selection:text-black font-sans">
      
      {/* Background Ambient Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-900/20 rounded-full blur-[128px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto h-full flex flex-col px-6 pt-12 pb-6">
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-black tracking-tighter mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-[0_0_15px_rgba(0,255,255,0.3)]">
            {t.titlePart1}<span className="text-white">{t.titlePart2}</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed px-4">
            {t.subtitle}
          </p>
        </header>

        {/* Room List - Single Column for Mobile App Feel */}
        <div className="flex flex-col gap-6 overflow-y-auto pb-10 scrollbar-hide">
          {ROOMS.map((room) => (
            <div 
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className="group relative h-48 w-full rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-white/30 transition-all active:scale-95 shadow-lg"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${room.theme.backgroundUrl})` }}
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex justify-between items-end">
                  <div className="flex-1 pr-4">
                    <h3 className="text-2xl font-bold text-white mb-1.5 leading-none group-hover:text-cyan-400 transition-colors">
                      {room.name}
                    </h3>
                    <p className="text-gray-300 text-xs leading-snug line-clamp-2 opacity-80">
                      {room.description}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0 flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5">
                    <span className="text-lg">
                      {room.game === 'liars-dice' ? '🎲' : '🎤'}
                    </span>
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                      {room.game === 'liars-dice' ? 'Play' : 'Chat'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Locked Icon */}
              {room.password && (
                <div className="absolute top-4 right-4 bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 border border-white/5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-white/80">
                    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">{t.locked}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Render Modal if Room Selected */}
      {selectedRoom && (
        <JoinModal 
          room={selectedRoom} 
          onClose={() => setSelectedRoom(null)} 
        />
      )}

    </main>
  );
}