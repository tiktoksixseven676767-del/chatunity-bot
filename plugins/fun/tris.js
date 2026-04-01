let trisSessions = {};

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const chatId = m.chat;
    const senderId = m.sender;

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

    // --- COMANDO INIZIALE .tris ---
    if (command === 'tris') {
        if (!text) return m.reply(`Indica il nome della stanza!\nEsempio: *${usedPrefix + command} test*`);
        let roomName = text.toLowerCase().trim();
        let roomId = chatId + roomName;
        if (trisSessions[roomId]) return m.reply('Stanza già occupata.');

        trisSessions[roomId] = { name: roomName, board: Array(9).fill(null), p1: senderId, p2: null, turn: senderId, status: 'waiting' };
        
        // Timeout 5 minuti
        trisSessions[roomId].timeout = setTimeout(() => {
            if (trisSessions[roomId]) {
                conn.sendMessage(chatId, { text: `⏰ Stanza *${roomName}* chiusa per inattività.` });
                delete trisSessions[roomId];
            }
        }, 5 * 60 * 1000);

        return m.reply(`🎮 Stanza *${roomName}* creata!\nUsa *.entratris ${roomName}* per sfidarlo.`);
    }

    // --- ENTRATRIS ---
    if (command === 'entratris') {
        let roomName = text.toLowerCase().trim();
        let roomId = chatId + roomName;
        let s = trisSessions[roomId];
        if (!s) return m.reply('Stanza non trovata.');
        if (s.p1 === senderId) return m.reply('Non puoi sfidare te stesso.');

        s.p2 = senderId;
        s.status = 'playing';

        // Genera i bottoni per la prima mossa
        let buttons = [];
        for (let i = 0; i < 9; i++) {
            buttons.push({ buttonId: `${i + 1}`, buttonText: { displayText: `${i + 1}` }, type: 1 });
        }

        return conn.sendMessage(chatId, {
            text: `🎮 Sfida Iniziata!\n❌ @${s.p1.split('@')[0]}\n⭕ @${senderId.split('@')[0]}\n\n${renderBoard(s.board)}\n\nTocca a @${s.p1.split('@')[0]}!`,
            buttons: buttons,
            footer: `Stanza: ${roomName}`,
            mentions: [s.p1, senderId]
        });
    }
};

// --- LOGICA PULSANTI (Gestita in before) ---
handler.before = async function (m, { conn }) {
    const chatId = m.chat;
    const senderId = m.sender;
    const body = m.text || m.body || "";

    if (!/^[1-9]$/.test(body)) return; // Se non è un numero 1-9, ignora

    let room = Object.values(trisSessions).find(s => 
        s.status === 'playing' && (s.p1 === senderId || s.p2 === senderId)
    );

    if (!room) return;
    if (room.turn !== senderId) return; // Ignora se non è il suo turno

    let move = parseInt(body) - 1;
    if (room.board[move]) return;

    room.board[move] = (senderId === room.p1) ? 'X' : 'O';
    let win = checkWinner(room.board);

    if (win) {
        let res = `${renderBoard(room.board)}\n\n` + (win === 'Pareggio' ? '🤝 Pareggio!' : `🏆 Vince @${(win === 'X' ? room.p1 : room.p2).split('@')[0]}!`);
        await conn.sendMessage(chatId, { text: res, mentions: [room.p1, room.p2] });
        clearTimeout(room.timeout);
        delete trisSessions[chatId + room.name];
    } else {
        room.turn = (senderId === room.p1) ? room.p2 : room.p1;
        
        // Rigenera i bottoni con solo le caselle rimaste
        let buttons = [];
        room.board.forEach((val, i) => {
            if (!val) buttons.push({ buttonId: `${i + 1}`, buttonText: { displayText: `${i + 1}` }, type: 1 });
        });

        await conn.sendMessage(chatId, { 
            text: `${renderBoard(room.board)}\nTocca a @${room.turn.split('@')[0]}`,
            buttons: buttons,
            footer: `Stanza: ${room.name}`,
            mentions: [room.turn]
        });
    }
    return true;
};

handler.help = ['tris', 'entratris'];
handler.tags = ['games'];
handler.command = /^(tris|entratris)$/i;

export default handler;
