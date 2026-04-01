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

    // --- LOGICA MOSSA ---
    if (text.startsWith('mossa')) {
        let [_, roomName, moveStr] = text.split(' ');
        let roomId = chatId + roomName;
        let s = trisSessions[roomId];

        if (!s || s.status !== 'playing') return;
        if (s.turn !== senderId) return m.reply('Non è il tuo turno!');

        let move = parseInt(moveStr) - 1;
        if (s.board[move]) return m.reply('Casella occupata!');

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
                if (!val) buttons.push({ buttonId: `${usedPrefix}tris mossa ${roomName} ${i + 1}`, buttonText: { displayText: `${i + 1}` }, type: 1 });
            });

            await conn.sendMessage(chatId, { 
                text: `${renderBoard(s.board)}\nTocca a @${s.turn.split('@')[0]}`,
                buttons: buttons,
                footer: `Stanza: ${roomName}`,
                mentions: [s.turn]
            });
        }
        return;
    }

    // --- CREAZIONE STANZA ---
    if (command === 'tris') {
        if (!text) return m.reply(`Indica un nome! Esempio: *${usedPrefix}tris test*`);
        let roomName = text.toLowerCase().trim();
        let roomId = chatId + roomName;
        if (trisSessions[roomId]) return m.reply('Stanza già occupata.');

        trisSessions[roomId] = { name: roomName, board: Array(9).fill(null), p1: senderId, p2: null, turn: senderId, status: 'waiting' };
        
        // Timeout 5 minuti
        setTimeout(() => {
            if (trisSessions[roomId] && trisSessions[roomId].status === 'waiting') {
                conn.sendMessage(chatId, { text: `⏰ Stanza *${roomName}* chiusa.` });
                delete trisSessions[roomId];
            }
        }, 5 * 60 * 1000);

        return m.reply(`🎮 Stanza *${roomName}* creata!\nSfidante, scrivi: *.entratris ${roomName}*`);
    }

    // --- ENTRATRIS ---
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
            buttons.push({ buttonId: `${usedPrefix}tris mossa ${roomName} ${i}`, buttonText: { displayText: `${i}` }, type: 1 });
        }

        return conn.sendMessage(chatId, {
            text: `🎮 Partita Iniziata!\n❌ @${s.p1.split('@')[0]}\n⭕ @${senderId.split('@')[0]}\n\n${renderBoard(s.board)}\n\nTocca a @${s.p1.split('@')[0]}!`,
            buttons: buttons,
            footer: `Stanza: ${roomName}`,
            mentions: [s.p1, senderId]
        });
    }
};

handler.help = ['tris', 'entratris'];
handler.tags = ['games'];
handler.command = /^(tris|entratris)$/i;

export default handler;
