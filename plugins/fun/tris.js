let trisSessions = {};

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const chatId = m.chat;
    const senderId = m.sender;

    // --- FUNZIONI INTERNE ---
    const renderBoard = (b) => {
        const em = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
        let out = "";
        for (let i = 0; i < 9; i++) {
            out += b[i] ? (b[i] === 'X' ? '❌' : '⭕') : em[i];
            if ((i + 1) % 3 === 0) out += "\n";
            else out += "  ";
        }
        return out;
    };

    const checkWinner = (b) => {
        const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        for (let [a, b_idx, c] of wins) {
            if (b[a] && b[a] === b[b_idx] && b[a] === b[c]) return b[a];
        }
        return b.includes(null) ? null : 'Pareggio';
    };

    // --- COMANDO .tris ---
    if (command === 'tris') {
        if (!text) return m.reply(`Indica un nome! Esempio: *${usedPrefix}tris ciao*`);
        if (/^[1-9]$/.test(text)) return m.reply("❌ Il nome della stanza non può essere un numero singolo.");
        
        let roomName = text.toLowerCase().trim();
        let roomId = chatId + roomName;
        if (trisSessions[roomId]) return m.reply('Stanza già occupata.');

        trisSessions[roomId] = { name: roomName, board: Array(9).fill(null), p1: senderId, p2: null, turn: senderId, status: 'waiting' };
        
        return m.reply(`🎮 Stanza *${roomName}* creata!\nSfidante, scrivi: *.entratris ${roomName}*`);
    }

    // --- COMANDO .entratris ---
    if (command === 'entratris') {
        let roomName = text.toLowerCase().trim();
        let roomId = chatId + roomName;
        let s = trisSessions[roomId];
        if (!s) return m.reply('Stanza non trovata.');
        if (s.p1 === senderId) return m.reply('Non puoi giocare da solo.');

        s.p2 = senderId;
        s.status = 'playing';

        let buttons = [];
        for (let i = 1; i <= 9; i++) {
            buttons.push({ index: i, quickReplyButton: { displayText: `${i}`, id: `${i}` } });
        }

        return conn.sendMessage(chatId, {
            text: `🎮 Partita Iniziata!\n❌ @${s.p1.split('@')[0]}\n⭕ @${senderId.split('@')[0]}\n\n${renderBoard(s.board)}\n\nTocca a @${s.p1.split('@')[0]}!`,
            templateButtons: buttons,
            footer: `Stanza: ${roomName}`,
            mentions: [s.p1, senderId]
        });
    }
};

handler.before = async function (m, { conn }) {
    const chatId = m.chat;
    const senderId = m.sender;
    const txt = (m.text || m.body || "").trim().replace(/\./g, ''); // Toglie il punto se presente

    if (!/^[1-9]$/.test(txt)) return;

    let roomId = Object.keys(trisSessions).find(id => 
        id.startsWith(chatId) && trisSessions[id].status === 'playing' && (trisSessions[id].p1 === senderId || trisSessions[id].p2 === senderId)
    );

    if (!roomId) return;
    let s = trisSessions[roomId];
    if (s.turn !== senderId) return;

    let move = parseInt(txt) - 1;
    if (s.board[move]) return m.reply('Occupata!');

    s.board[move] = (senderId === s.p1) ? 'X' : 'O';
    let win = checkWinner(s.board);

    if (win) {
        let res = `${renderBoard(s.board)}\n\n` + (win === 'Pareggio' ? '🤝 Pareggio!' : `🏆 Vince @${(win === 'X' ? s.p1 : s.p2).split('@')[0]}!`);
        await conn.sendMessage(chatId, { text: res, mentions: [s.p1, s.p2] });
        delete trisSessions[roomId];
    } else {
        s.turn = (senderId === s.p1) ? s.p2 : s.p1;
        let buttons = [];
        s.board.forEach((val, i) => {
            if (!val) buttons.push({ index: i + 1, quickReplyButton: { displayText: `${i + 1}`, id: `${i + 1}` } });
        });

        await conn.sendMessage(chatId, { 
            text: `${renderBoard(s.board)}\nTocca a @${s.turn.split('@')[0]}`,
            templateButtons: buttons,
            footer: `Stanza: ${s.name}`,
            mentions: [s.turn]
        });
    }
    return true;
};

handler.command = /^(tris|entratris)$/i;
export default handler;
