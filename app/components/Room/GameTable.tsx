'use client'

import { useState } from 'react';
import Seat from './Seat';
import { IAgoraRTCRemoteUser, ICameraVideoTrack } from 'agora-rtc-sdk-ng';
import { GameState, UserInfoMap } from './RoomManager';
import { t } from '@/utils/i18n';

interface LocalUser {
  uid: string;
  videoTrack?: ICameraVideoTrack;
  hasVideo: boolean;
  username: string;
  avatar: string;
}

interface Props {
  localUser: LocalUser | null;
  remoteUsers: IAgoraRTCRemoteUser[];
  userInfo: UserInfoMap;
  gameState: GameState;
  onStartGame: () => void;
  onRollDice: () => void;
  onBid: (qty: number, face: number) => void;
  onChallenge: () => void;
}

export default function GameTable({ localUser, remoteUsers, userInfo, gameState, onStartGame, onRollDice, onBid, onChallenge }: Props) {
  const [bidQty, setBidQty] = useState(1);
  const [bidFace, setBidFace] = useState(2);

  const opponent = remoteUsers.length > 0 ? remoteUsers[0] : null;
  
  const isMyTurn = localUser ? gameState.currentTurnUid === localUser.uid : false;
  const isOpponentTurn = opponent ? gameState.currentTurnUid === opponent.uid.toString() : false;
  const lastBid = gameState.lastBid;

  const validateBid = () => {
      if (!lastBid) return true;
      if (bidQty > lastBid.quantity) return true;
      if (bidQty === lastBid.quantity && bidFace > lastBid.face) return true;
      return false;
  };

  const handleBidClick = () => {
      if (validateBid()) {
        onBid(bidQty, bidFace);
        setBidQty(1);
        setBidFace(2);
      }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between py-8 px-4">
      
      {/* --- TOP: OPPONENT --- */}
      <div className="flex justify-center relative h-1/4">
        {opponent ? (
           <Seat 
             user={opponent}
             label={userInfo[opponent.uid.toString()]?.username || "Opponent"}
             avatar={userInfo[opponent.uid.toString()]?.avatar || "👤"}
             isLocal={false}
             isActive={isOpponentTurn}
             // Check if opponent is winner
             isWinner={gameState.phase === 'revealed' && gameState.winnerUid === opponent.uid.toString()}
             className="scale-90"
             dice={gameState.phase === 'revealed' ? gameState.dice[opponent.uid.toString()] : undefined}
             diceCount={gameState.dice[opponent.uid.toString()]?.length}
           />
        ) : (
           <div className="flex flex-col items-center justify-center opacity-40 animate-pulse">
             <div className="w-20 h-20 rounded-full border-4 border-dashed border-white flex items-center justify-center mb-2">?</div>
             <p className="text-xs font-bold">{t.waitingOpponent}</p>
           </div>
        )}
      </div>

      {/* --- CENTER BOARD --- */}
      <div className="flex-1 flex flex-col items-center justify-center z-20 relative">
         <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-full max-w-[300px] shadow-2xl mb-20 relative z-10">
            
            {gameState.phase === 'idle' && (
              <div className="text-center animate-fade-in">
                 <div className="text-5xl mb-2">🎲</div>
                 <h3 className="text-xl font-bold text-white mb-4">{t.gameName}</h3>
                 {opponent ? (
                    <button onClick={onStartGame} className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition shadow-[0_0_15px_rgba(6,182,212,0.5)]">{t.startGame}</button>
                 ) : (
                    <p className="text-gray-400 text-xs">等待玩家加入...</p>
                 )}
              </div>
            )}

            {gameState.phase === 'playing' && (
              <div className="flex flex-col items-center">
                 <div className="mb-6 text-center">
                    <p className="text-cyan-400 font-mono text-[10px] tracking-widest mb-1">{t.currentBid}</p>
                    {lastBid ? (
                        <div className="flex items-center gap-2 text-3xl font-black">
                            <span>{lastBid.quantity}</span>
                            <span className="text-lg text-gray-500">x</span>
                            <div className="w-8 h-8 bg-white text-black rounded flex items-center justify-center shadow-lg">{lastBid.face}</div>
                        </div>
                    ) : (
                        <p className="text-white text-sm font-bold italic opacity-80">{t.placeFirstBid}</p>
                    )}
                 </div>

                 {isMyTurn ? (
                     <div className="w-full animate-fade-in-up">
                         <div className="flex gap-2 justify-center mb-4">
                            <div className="flex flex-col items-center">
                               <label className="text-[9px] text-gray-400 mb-1">{t.count}</label>
                               <input type="number" min="1" max="10" value={bidQty} onChange={e => setBidQty(Number(e.target.value))} className="w-12 bg-white/10 border border-white/30 rounded p-2 text-center text-white font-bold" />
                            </div>
                            <span className="text-white self-center mt-4 text-xs">x</span>
                            <div className="flex flex-col items-center">
                               <label className="text-[9px] text-gray-400 mb-1">{t.face}</label>
                               <div className="flex gap-1">
                                  {[1,2,3,4,5,6].map(f => (
                                      <button key={f} onClick={() => setBidFace(f)} className={`w-8 h-10 rounded border text-sm font-bold transition ${bidFace === f ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-transparent border-white/20 text-white'}`}>{f}</button>
                                  ))}
                               </div>
                            </div>
                         </div>

                         <div className="flex gap-2">
                             {lastBid && <button onClick={onChallenge} className="flex-1 py-3 bg-red-500/90 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg transition">{t.liar}</button>}
                             <button onClick={handleBidClick} className="flex-[2] py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl shadow-lg transition">{t.bidBtn}</button>
                         </div>
                     </div>
                 ) : (
                     <div className="text-gray-500 text-xs animate-pulse flex items-center gap-2">
                       <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                       {t.waitingOpponent}
                     </div>
                 )}
              </div>
            )}

            {gameState.phase === 'revealed' && (
                <div className="text-center">
                    <h3 className="text-xl font-black text-white mb-2">{t.roundOver}</h3>
                    <p className="text-sm text-cyan-300 mb-4 leading-relaxed">{gameState.resultMessage}</p>
                    <button onClick={onStartGame} className="w-full py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition shadow-lg">{t.nextRound}</button>
                </div>
            )}
         </div>

         {/* MY HAND (Bottom Center) */}
         {localUser && gameState.dice[localUser.uid] && gameState.phase === 'playing' && (
           <div className="absolute -bottom-10 bg-black/80 px-4 py-3 rounded-t-2xl border-t border-x border-cyan-500/30 shadow-[0_-5px_20px_rgba(0,243,255,0.2)] z-30">
              <p className="text-[9px] text-cyan-400 text-center mb-1 uppercase tracking-widest">{t.yourHand}</p>
              <div className="flex justify-center gap-2">
                {gameState.dice[localUser.uid].map((d, i) => (
                  <div key={i} className="w-10 h-10 bg-gradient-to-b from-white to-gray-300 text-black rounded-lg flex items-center justify-center font-bold shadow-md text-xl border border-white">{d}</div>
                ))}
              </div>
           </div>
         )}
      </div>

      {/* --- BOTTOM: ME --- */}
      <div className="flex flex-col items-center h-1/4 justify-end pb-4 relative z-10">
         {localUser && (
            <Seat 
              user={localUser}
              label={`${localUser.username} ${t.you}`}
              avatar={localUser.avatar}
              isLocal={true}
              isActive={isMyTurn}
              // Check if I am winner
              isWinner={gameState.phase === 'revealed' && gameState.winnerUid === localUser.uid}
              dice={gameState.phase === 'revealed' ? gameState.dice[localUser.uid] : undefined}
              diceCount={0} 
            />
         )}
      </div>

    </div>
  );
}