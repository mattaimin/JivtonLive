'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RoomConfig } from '@/types';
import { AVATARS } from '@/config/rooms';
import { t } from '@/utils/i18n';

interface Props {
  room: RoomConfig;
  onClose: () => void;
}

export default function JoinModal({ room, onClose }: Props) {
  const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('agora-party-username');
    const savedAvatar = localStorage.getItem('agora-party-avatar');
    if (savedName) setUsername(savedName);
    if (savedAvatar) setSelectedAvatar(savedAvatar);
  }, []);

  const handleJoin = () => {
    if (room.password && password !== room.password) {
      setError(t.incorrectPass);
      return;
    }
    if (!username.trim()) {
      setError(t.enterName);
      return;
    }

    localStorage.setItem('agora-party-username', username);
    localStorage.setItem('agora-party-avatar', selectedAvatar);

    const params = new URLSearchParams({
      name: username,
      avatar: selectedAvatar
    });
    router.push(`/room/${room.id}?${params.toString()}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-[#333] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <div 
          className="h-24 flex items-center justify-center relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${room.theme.primaryColor}22, ${room.theme.accentColor}22)` }}
        >
          <h2 className="text-3xl font-black text-white tracking-tighter relative z-10 drop-shadow-md">
            {room.name}
          </h2>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">{t.chooseAvatar}</label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {AVATARS.map(av => (
                <button
                  key={av}
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-12 h-12 text-2xl flex items-center justify-center rounded-full border-2 transition-all ${
                    selectedAvatar === av 
                      ? `bg-white/10 scale-110` 
                      : 'border-transparent hover:bg-white/5'
                  }`}
                  style={{ borderColor: selectedAvatar === av ? room.theme.primaryColor : 'transparent' }}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">{t.nickname}</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none transition"
                placeholder="CyberPunk_01"
              />
            </div>

            {room.password && (
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">{t.roomPass}</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none transition"
                  placeholder={t.enterPass}
                />
              </div>
            )}
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

          <button
            onClick={handleJoin}
            className="w-full py-4 rounded-xl font-bold text-lg text-black transition-transform active:scale-95 shadow-[0_0_20px_rgba(0,243,255,0.3)]"
            style={{ 
              background: `linear-gradient(to right, ${room.theme.primaryColor}, ${room.theme.accentColor})` 
            }}
          >
            {t.enterRoom}
          </button>

        </div>
      </div>
    </div>
  );
}