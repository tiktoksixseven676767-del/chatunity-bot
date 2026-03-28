import TicTacToe from '../lib/tictactoe.js';
const handler = async (m, {conn, usedPrefix, command, text}) => {
  conn.game = conn.game ? conn.game : {};
  if (Object.values(conn.game).find((room) => room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender))) throw '*[❗] _STAI GIA GIOCANDO CON QUALCUNO_*';
  if (!text) throw `*[❗] _DEVI DARE UN NOME ALLA SALA_*\n\n*—◉ _ESEMPIO_*\n*◉ ${usedPrefix + command} fabri vince*`;
  let room = Object.values(conn.game).find((room) => room.state === 'WAITING' && (text ? room.name === text : true));
  if (room) {
    await m.reply('*[🕹️] _LA PARTITA STA INIZIANDO, UN GIOCATORE SI è UNITO_*');
    room.o = m.chat;
    room.game.playerO = m.sender;
    room.state = 'PLAYING';
    const arr = room.game.render().map((v) => {
      return {
        X: '❎',
        O: '⭕',
        1: '1️⃣',
        2: '2️⃣',
        3: '3️⃣',
        4: '4️⃣',
        5: '5️⃣',
        6: '6️⃣',
        7: '7️⃣',
        8: '8️⃣',
        9: '9️⃣',
      }[v];
    });
    const str = `
🎮 _PARTITA TRIS _🎮

❎ = @${room.game.playerX.split('@')[0]}
⭕ = @${room.game.playerO.split('@')[0]}

        ${arr.slice(0, 3).join('')}
        ${arr.slice(3, 6).join('')}
        ${arr.slice(6).join('')}

*_TURNO DI_* @${room.game.currentTurn.split('@')[0]}
`.trim();
    if (room.x !== room.o) await conn.sendMessage(room.x, {text: str, mentions: this.parseMention(str)}, {quoted: m});
    await conn.sendMessage(room.o, {text: str, mentions: conn.parseMention(str)}, {quoted: m});
  } else {
    room = {
      id: 'tictactoe-' + (+new Date),
      x: m.chat,
      o: '',
      game: new TicTacToe(m.sender, 'o'),
      state: 'WAITING'};
    if (text) room.name = text;
    conn.sendButton(m.chat, `*🕹 _GIOCA A TRIS_🎮*\n\n*◉ _ASPETTO IL SECONDO GIOCATORE_*\n*◉_ PER ELIMINARE LA PARTITA PRECEDENTE_ ${usedPrefix}delttt*`, wm, [['UNISCITI E GIOCA', `${usedPrefix + command} ${text}`]], m, {mentions: conn.parseMention(text)});
    conn.game[room.id] = room;
  }
};
handler.command = /^(tris|ttc|ttt|xo)$/i;
export default handler;