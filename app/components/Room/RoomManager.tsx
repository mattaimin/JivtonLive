'use client'

import { useEffect, useRef, useState } from 'react';
import { RoomConfig } from '@/types';
import GameTable from './GameTable';
import { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import AgoraRTM, { RtmChannel, RtmClient } from 'agora-rtm-sdk';
import { getToken, getRtmToken } from '@/actions';
import { t } from '@/utils/i18n';

interface Props {
  room: RoomConfig;
  username: string;
  avatar: string;
}

export interface Bid {
  uid: string;
  quantity: number;
  face: number;
}

export interface GameState {
  phase: 'idle' | 'playing' | 'revealed';
  dice: Record<string, number[]>;
  currentTurnUid: string;
  lastBid: Bid | null;
  resultMessage?: string;
}

export type UserInfoMap = Record<string, { username: string; avatar: string }>;

export default function RoomManager({ room, username, avatar }: Props) {
  const client = useRef<IAgoraRTCClient | null>(null);
  const rtmClient = useRef<RtmClient | null>(null);
  const rtmChannel = useRef<RtmChannel | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfoMap>({});
  const [localUid, setLocalUid] = useState<string>('');
  
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | undefined>(undefined);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | undefined>(undefined);
  const [joined, setJoined] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [permissionError, setPermissionError] = useState(false);

  const [gameState, setGameState] = useState<GameState>({
    phase: 'idle',
    dice: {},
    currentTurnUid: '',
    lastBid: null
  });
  // Ref to access state inside event listeners
  const gameStateRef = useRef(gameState);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  const getAllPlayerIds = () => {
    if (!localUid) return [];
    const ids = [localUid, ...remoteUsers.map(u => u.uid.toString())];
    return ids.sort(); 
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed", e));
        setIsMusicPlaying(true);
      }
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let isMounted = true;

    if (audioRef.current) {
        audioRef.current.volume = 0.3;
        audioRef.current.play()
          .then(() => setIsMusicPlaying(true))
          .catch(() => console.log("Autoplay blocked"));
    }

    const init = async () => {
      try {
        const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
        client.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

        client.current.on('user-published', async (user, mediaType) => {
          await client.current?.subscribe(user, mediaType);
          if (mediaType === 'video') {
             setRemoteUsers(prev => {
               if (prev.find(u => u.uid === user.uid)) return prev;
               return [...prev, user];
             });
          }
          if (mediaType === 'audio') user.audioTrack?.play();
          fetchUserInfo(user.uid.toString());
        });

        client.current.on('user-unpublished', (user, mediaType) => {
          if (mediaType === 'video') {
             setRemoteUsers(prev => [...prev]); 
          }
        });

        client.current.on('user-left', (user) => {
          setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
          
          // STOP GAME if opponent leaves
          if (gameStateRef.current.phase === 'playing') {
             setGameState(prev => ({
                 ...prev,
                 phase: 'revealed',
                 resultMessage: "对手已离开，游戏结束。请等待玩家返回。(Opponent left. Game Over. Please wait.)"
             }));
          }
        });

        const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID!;
        const uidVal = Math.floor(Math.random() * 100000);
        const uidStr = String(uidVal);
        setLocalUid(uidStr);
        
        const token = await getToken(room.id, uidVal);
        const rtmToken = await getRtmToken(uidStr);

        if (!isMounted) return;

        rtmClient.current = AgoraRTM.createInstance(appId);
        await rtmClient.current.login({ uid: uidStr, token: rtmToken });
        await rtmClient.current.addOrUpdateLocalUserAttributes({ username, avatar });

        const channel = rtmClient.current.createChannel(room.id);
        rtmChannel.current = channel;
        await channel.join();

        channel.on('MemberJoined', (memberId) => fetchUserInfo(memberId));

        channel.on('ChannelMessage', (msg, senderId) => {
            const data = JSON.parse(msg.text || '{}');
            
            if (data.type === 'START_GAME') {
                const allIds = [uidStr, ...data.playerIds].sort();
                setGameState({
                    phase: 'playing',
                    dice: {}, 
                    currentTurnUid: allIds[0],
                    lastBid: null,
                    resultMessage: undefined
                });
                handleRollDice(uidStr);
            } 
            else if (data.type === 'ROLL') {
                setGameState(prev => ({
                    ...prev,
                    dice: { ...prev.dice, [senderId]: data.values }
                }));
            }
            else if (data.type === 'BID') {
                setGameState(prev => ({
                    ...prev,
                    lastBid: { uid: senderId, quantity: data.quantity, face: data.face },
                    currentTurnUid: data.nextTurn
                }));
            }
            else if (data.type === 'CHALLENGE') {
                const loserName = data.loserName; 
                const success = data.success;
                const text = success 
                  ? t.challengeWon(data.total, data.face, loserName)
                  : t.challengeLost(data.total, data.face, loserName);

                setGameState(prev => ({
                    ...prev,
                    phase: 'revealed',
                    resultMessage: text
                }));
            }
        });

        const members = await channel.getMembers();
        members.forEach(m => fetchUserInfo(m));

        await client.current.join(appId, room.id, token, uidVal);
        
        try {
            const [mic, cam] = await AgoraRTC.createMicrophoneAndCameraTracks();
            if (!isMounted) { 
                mic.close(); cam.close(); return; 
            }
            
            setLocalAudioTrack(mic);
            setLocalVideoTrack(cam);
            await client.current.publish([mic, cam]);
        } catch (mediaErr: any) {
            // This catches the permission error and triggers the UI popup
            console.warn("Media permission failed:", mediaErr);
            if (mediaErr.code === 'PERMISSION_DENIED' || mediaErr.name === 'NotAllowedError') {
               setPermissionError(true);
            }
        }
        
        setJoined(true);

      } catch (err) {
        console.error("Failed to join room:", err);
      }
    };

    const fetchUserInfo = async (uid: string) => {
        if (!rtmClient.current) return;
        try {
            const attrs = await rtmClient.current.getUserAttributes(uid);
            if (attrs.username) {
                setUserInfo(prev => ({
                    ...prev,
                    [uid]: { username: attrs.username, avatar: attrs.avatar || "👤" }
                }));
            }
        } catch (err) { console.warn(err); }
    };

    init();

    return () => {
      isMounted = false;
      localAudioTrack?.close();
      localVideoTrack?.close();
      client.current?.leave();
      rtmChannel.current?.leave();
      rtmClient.current?.logout();
    };
  }, [room.id]);

  const handleRollDice = async (uid: string) => {
      const newDice = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
      setGameState(prev => ({ ...prev, dice: { ...prev.dice, [uid]: newDice } }));
      const msg = JSON.stringify({ type: 'ROLL', values: newDice });
      await rtmChannel.current?.sendMessage({ text: msg });
  };

  const handleStartGame = async () => {
      // Ensure we have opponents to play with
      if (remoteUsers.length === 0) {
          setGameState({
            phase: 'idle',
            dice: {},
            currentTurnUid: '',
            lastBid: null,
            resultMessage: undefined
          });
          return;
      }

      const remoteIds = remoteUsers.map(u => u.uid.toString());
      const allIds = [localUid, ...remoteIds].sort();
      
      const msg = JSON.stringify({ type: 'START_GAME', playerIds: remoteIds });
      await rtmChannel.current?.sendMessage({ text: msg });

      setGameState({
        phase: 'playing',
        dice: {},
        currentTurnUid: allIds[0],
        lastBid: null
      });
      
      handleRollDice(localUid);
  };

  const handlePlaceBid = async (quantity: number, face: number) => {
      const allPlayers = getAllPlayerIds();
      const myIndex = allPlayers.indexOf(localUid);
      const nextIndex = (myIndex + 1) % allPlayers.length;
      const nextUid = allPlayers[nextIndex];

      const msg = JSON.stringify({ 
        type: 'BID', 
        quantity, 
        face, 
        nextTurn: nextUid 
      });
      
      await rtmChannel.current?.sendMessage({ text: msg });
      
      setGameState(prev => ({
          ...prev,
          lastBid: { uid: localUid, quantity, face },
          currentTurnUid: nextUid
      }));
  };

  const handleChallenge = async () => {
      if (!gameState.lastBid) return;
      
      let totalCount = 0;
      const targetFace = gameState.lastBid.face;
      
      Object.values(gameState.dice).forEach(hand => {
          hand.forEach(die => {
              if (die === targetFace || (targetFace !== 1 && die === 1)) {
                  totalCount++;
              }
          });
      });

      const bid = gameState.lastBid;
      const success = totalCount < bid.quantity; 
      
      const loserName = success ? (userInfo[bid.uid]?.username || 'Bidder') : username;
      const resultText = success 
        ? t.challengeWon(totalCount, bid.face, loserName)
        : t.challengeLost(totalCount, bid.face, loserName);

      const msg = JSON.stringify({ 
          type: 'CHALLENGE', 
          success, 
          total: totalCount, 
          face: bid.face, 
          loserName 
      });
      await rtmChannel.current?.sendMessage({ text: msg });

      setGameState(prev => ({
          ...prev,
          phase: 'revealed',
          resultMessage: resultText
      }));
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: `url(${room.theme.backgroundUrl})` }} />
      <audio ref={audioRef} src={room.theme.audioUrl} loop className="hidden" />

      {/* Permission Denied Modal (Chinese) */}
      {permissionError && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
          <div className="bg-[#1F1F1F] p-6 rounded-2xl border border-red-500/30 shadow-2xl max-w-sm text-center">
             <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
               <span className="text-3xl">📷</span>
             </div>
             <h3 className="text-xl font-bold text-white mb-2">需要摄像头权限</h3>
             <p className="text-gray-400 text-sm mb-6">请在浏览器设置中允许访问摄像头以加入游戏。</p>
             <button 
               onClick={() => window.location.reload()}
               className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition"
             >
               刷新页面
             </button>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full h-full flex flex-col">
        
        <div className="p-4 flex justify-between items-start">
           <div>
             <h1 className="text-2xl font-black text-white drop-shadow-lg">{room.name}</h1>
             <div className="flex items-center gap-2 mt-1">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-xs text-gray-300 font-mono">{t.live} // {remoteUsers.length + 1} {t.players}</span>
             </div>
           </div>
           
           <div className="flex gap-2">
              <button 
                onClick={toggleMusic}
                className={`px-3 py-1.5 border rounded-lg font-bold text-xs transition ${isMusicPlaying ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-gray-800/50 border-gray-600 text-gray-400'}`}
              >
                {isMusicPlaying ? '🎵 ON' : '🎵 OFF'}
              </button>

              <button onClick={() => window.location.href = '/'} className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 border border-red-500 text-red-500 text-xs rounded-lg font-bold transition">
                {t.leaveRoom}
              </button>
           </div>
        </div>

        <GameTable 
          localUser={joined ? {
             uid: localUid,
             videoTrack: localVideoTrack,
             hasVideo: !!localVideoTrack, 
             username: username,
             avatar: avatar
          } : null}
          remoteUsers={remoteUsers}
          userInfo={userInfo}
          gameState={gameState}
          onStartGame={handleStartGame}
          onRollDice={() => handleRollDice(localUid)}
          onBid={handlePlaceBid}
          onChallenge={handleChallenge}
        />
      </div>
    </div>
  );
}