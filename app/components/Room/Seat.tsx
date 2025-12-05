'use client'

import { useEffect, useRef } from 'react';
import { IAgoraRTCRemoteUser, ICameraVideoTrack } from 'agora-rtc-sdk-ng';
import { t } from '@/utils/i18n';

interface Props {
  user?: IAgoraRTCRemoteUser | { uid: string | number; videoTrack?: ICameraVideoTrack; hasVideo: boolean };
  label?: string; 
  avatar?: string;
  isLocal?: boolean;
  isActive?: boolean; 
  isWinner?: boolean;
  className?: string;
  diceCount?: number;
  dice?: number[];
}

export default function Seat({ user, label, avatar, isLocal, isActive, isWinner, className, diceCount, dice }: Props) {
  const videoRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (user && user.videoTrack && videoRef.current) {
      user.videoTrack.play(videoRef.current);
    }
  }, [user]);

  useEffect(() => {
    if (isWinner && audioRef.current) {
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch(e => console.warn("Win sound blocked", e));
    }
  }, [isWinner]);

  const showVideo = user?.hasVideo && user.videoTrack;
  const displayAvatar = user ? (avatar || "👤") : "🪑";

  return (
    <div className={`absolute flex flex-col items-center gap-2 w-24 md:w-32 transition-all duration-500 ${className} ${isActive || isWinner ? 'scale-110 z-30' : 'z-10'}`}>
      
      <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3" />

      {/* WINNER CROWN */}
      {isWinner && (
        <div className="absolute -top-16 flex flex-col items-center animate-bounce z-50">
           <span className="text-5xl filter drop-shadow-lg">👑</span>
           <span className="text-yellow-400 font-black text-xs tracking-widest bg-black/80 px-2 py-1 rounded border border-yellow-500 shadow-lg shadow-yellow-500/50">WINNER</span>
        </div>
      )}

      {/* REVEALED DICE */}
      {dice && !isLocal && (
         <div className="absolute -top-10 bg-black/80 px-2 py-1 rounded-lg border border-white/20 flex gap-1 shadow-xl z-50">
             {dice.map((d, i) => (
                 <span key={i} className="w-6 h-6 bg-white text-black text-xs font-bold flex items-center justify-center rounded">{d}</span>
             ))}
         </div>
      )}

      {/* HIDDEN DICE */}
      {!dice && (diceCount || 0) > 0 && !isLocal && (
        <div className="absolute -top-8 flex gap-1 animate-bounce">
          {Array.from({ length: diceCount || 0 }).map((_, i) => (
            <div key={i} className="w-3 h-3 md:w-4 md:h-4 bg-cyan-500 rounded-sm shadow-lg border border-black/50" title="Hidden Die" />
          ))}
        </div>
      )}

      {/* THINKING BADGE */}
      {isActive && !isLocal && (
          <div className="absolute -bottom-12 text-cyan-400 font-bold text-xs bg-black/80 px-2 py-1 rounded animate-pulse border border-cyan-500/30 whitespace-nowrap">
              {t.thinking}
          </div>
      )}

      {/* SEAT CIRCLE */}
      <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full border-4 ${isWinner ? 'border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.6)]' : (isActive ? 'border-cyan-400 shadow-[0_0_20px_rgba(0,243,255,0.6)]' : (isLocal ? 'border-white/50' : 'border-white/10'))} bg-gray-900 backdrop-blur-sm overflow-hidden group transition-all duration-500`}>
        
        {/* Background Avatar */}
        <div className="absolute inset-0 z-0 flex items-center justify-center text-4xl md:text-5xl select-none">
          {displayAvatar}
        </div>

        {/* Video Feed */}
        {showVideo && (
           <div ref={videoRef} className="absolute inset-0 w-full h-full object-cover bg-black z-10" />
        )}
      </div>

      {/* NAME TAG + AVATAR */}
      <div className={`px-3 py-1 rounded-full backdrop-blur-md border flex items-center gap-1.5 ${isActive || isWinner ? 'bg-black/80 border-white/40' : 'bg-black/60 border-white/10'}`}>
        {/* RESTORED: Avatar beside name */}
        <span className="text-sm select-none leading-none filter drop-shadow-md">
          {displayAvatar}
        </span>
        
        <span className={`text-xs font-bold ${isLocal ? 'text-cyan-400' : 'text-white'}`}>
          {label || t.emptySeat}
        </span>
      </div>

    </div>
  );
}