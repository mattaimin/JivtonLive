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
  className?: string;
  diceCount?: number;
  dice?: number[];
}

export default function Seat({ user, label, avatar, isLocal, isActive, className, diceCount, dice }: Props) {
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && user.videoTrack) {
      user.videoTrack.play(videoRef.current!);
    }
  }, [user]);

  return (
    <div className={`absolute flex flex-col items-center gap-2 w-24 md:w-32 transition-all duration-500 ${className} ${isActive ? 'scale-110 z-30' : 'z-10'}`}>
      
      {dice && (
         <div className="absolute -top-10 bg-black/80 px-2 py-1 rounded-lg border border-white/20 flex gap-1 shadow-xl z-50">
             {dice.map((d, i) => (
                 <span key={i} className="w-6 h-6 bg-white text-black text-xs font-bold flex items-center justify-center rounded">{d}</span>
             ))}
         </div>
      )}

      {!dice && diceCount && diceCount > 0 && (
        <div className="absolute -top-8 flex gap-1 animate-bounce">
          {Array.from({ length: diceCount }).map((_, i) => (
            <div key={i} className="w-3 h-3 md:w-4 md:h-4 bg-cyan-500 rounded-sm shadow-lg border border-black/50" title="Hidden Die" />
          ))}
        </div>
      )}

      {isActive && (
          <div className="absolute -bottom-12 text-cyan-400 font-bold text-xs bg-black/80 px-2 py-1 rounded animate-pulse border border-cyan-500/30">
              {t.thinking}
          </div>
      )}

      <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full border-4 ${isActive ? 'border-cyan-400 shadow-[0_0_20px_rgba(0,243,255,0.6)]' : (isLocal ? 'border-white/50' : 'border-white/10')} bg-black/40 backdrop-blur-sm overflow-hidden group`}>
        {user?.hasVideo ? (
           <div ref={videoRef} className="w-full h-full object-cover" />
        ) : (
           <div className="w-full h-full flex items-center justify-center text-4xl md:text-5xl select-none">
             {user ? (avatar || "👤") : "🪑"}
           </div>
        )}
      </div>

      <div className={`px-3 py-1 rounded-full backdrop-blur-md border ${isActive ? 'bg-cyan-900/80 border-cyan-500' : 'bg-black/60 border-white/10'}`}>
        <span className={`text-xs font-bold ${isLocal ? 'text-cyan-400' : 'text-white'}`}>
          {label || t.emptySeat}
        </span>
      </div>

    </div>
  );
}