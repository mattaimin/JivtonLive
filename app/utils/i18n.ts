// Simple Translation System
// Change this to 'en' to switch back to English
const LANG: 'zh' | 'en' = 'zh'; 

export const t = {
  // General
  loading: LANG === 'zh' ? "加载中..." : "Loading...",
  
  // Home / Lobby
  titlePart1: LANG === 'zh' ? "夜" : "NIGHT",
  titlePart2: LANG === 'zh' ? "生活" : "LIFE",
  subtitle: LANG === 'zh' 
    ? "数字时代的虚拟聚会。选个氛围，入座，开始玩。" 
    : "Virtual hangouts for the digital age. Pick a vibe, grab a seat, and play.",
  chooseAvatar: LANG === 'zh' ? "选择头像" : "Choose Avatar",
  nickname: LANG === 'zh' ? "昵称" : "Nickname",
  roomPass: LANG === 'zh' ? "房间密码" : "Room Password",
  enterPass: LANG === 'zh' ? "输入密码..." : "Enter code...",
  enterRoom: LANG === 'zh' ? "进入房间" : "ENTER ROOM",
  incorrectPass: LANG === 'zh' ? "密码错误" : "Incorrect Password",
  enterName: LANG === 'zh' ? "请输入昵称" : "Please enter a nickname",
  locked: LANG === 'zh' ? "需要密码" : "Locked",
  
  // Room UI
  live: LANG === 'zh' ? "直播中" : "LIVE",
  players: LANG === 'zh' ? "玩家" : "PLAYERS",
  leaveRoom: LANG === 'zh' ? "离开房间" : "LEAVE ROOM",
  you: LANG === 'zh' ? " (你)" : " (You)",
  emptySeat: LANG === 'zh' ? "空位" : "Open",
  
  // Game: Liar's Dice
  gameName: LANG === 'zh' ? "大话骰" : "Liar's Dice",
  waitingRound: LANG === 'zh' ? "等待下一轮..." : "Waiting for the next round...",
  startGame: LANG === 'zh' ? "开始游戏" : "START GAME",
  roundProgress: LANG === 'zh' ? "游戏进行中" : "ROUND IN PROGRESS",
  yourHand: LANG === 'zh' ? "你的骰子" : "Your Hand",
  shake: LANG === 'zh' ? "🎲 摇骰子" : "🎲 Shake Cup",
  currentBid: LANG === 'zh' ? "当前叫价" : "CURRENT BID",
  placeFirstBid: LANG === 'zh' ? "开始叫价" : "Place the first bid",
  yourTurn: LANG === 'zh' ? "轮到你了" : "YOUR TURN",
  count: LANG === 'zh' ? "数量" : "Count",
  face: LANG === 'zh' ? "点数" : "Face",
  liar: LANG === 'zh' ? "开！" : "LIAR!",
  bidBtn: LANG === 'zh' ? "叫价" : "BID",
  waitingOpponent: LANG === 'zh' ? "等待对手..." : "Waiting for opponent...",
  roundOver: LANG === 'zh' ? "本轮结束" : "ROUND OVER",
  nextRound: LANG === 'zh' ? "下一轮" : "NEXT ROUND",
  thinking: LANG === 'zh' ? "思考中..." : "Thinking...",
  
  // Game Logic Messages
  challengeWon: (total: number, face: number, loser: string) => 
    LANG === 'zh' 
      ? `挑战成功！场上只有 ${total} 个 ${face}。 ${loser} 喝酒！`
      : `Challenge WON! There were only ${total} ${face}s. ${loser} drinks!`,
  
  challengeLost: (total: number, face: number, loser: string) => 
    LANG === 'zh' 
      ? `挑战失败！场上有 ${total} 个 ${face}。 ${loser} 喝酒！`
      : `Challenge LOST! There were ${total} ${face}s. ${loser} drinks!`,
};