let trisSessions = {};

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const chatId = m.chat;
    const senderId = m.sender;

    // --- FUNZIONI INTERNE (Per evitare l'errore Illegal Return) ---
    const renderBoard = (board) => {
        let res = "";
        for (let i = 0; i < 9; i++) {
            res += board[i] ? (board[i] === 'X' ? '❌' : '⭕') : ` ${i + 1}️ `;
            if ((i + 1) % 3 === 0) res += "\n";
        }
        return res;
    };

    const checkWinner = (b) => {
        const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        for (let [a, b_idx, c] of wins) {
            if (b[a] && b[a] === b[b_idx] && b[a] === b[c]) return b[a];
        }
        return b.includes(null) ? null : 'Pareggio';
    };

    // --- COMANDO .tris <nome> ---
    if (command === 'tris') {
        if (!text) return m.reply(`Indica il nome della stanza! Esempio:\n*${usedPrefix + command} ciao*`);
        let roomName = text.toLowerCase().trim();
        let roomId = chatId + roomName;

        if (trisSessions[roomId]) return m.reply(`La stanza *${roomName}* è già occupata.`);

        trisSessions[roomId] = {
            name: roomName,
            board: Array(9).fill(null),
            p1: senderId,
            p2: null,
            turn: senderId,
            status: 'waiting'
        };
        return m.reply(`🎮 Stanza *${roomName}* creata!\n\nIn attesa di un avversario...\nDigita *${usedPrefix}entratris ${roomName}*`);
    }

    // --- COMANDO .entratris <nome> ---
    if (command === 'entratris') {
        if (!text) return m.reply(`Quale stanza? Esempio: *${usedPrefix}entratris ciao*`);
        let roomName = text.toLowerCase().trim();
        let roomId = chatId + roomName;

        if (!trisSessions[roomId]) return m.reply(`Stanza non trovata.`);
        if (trisSessions[roomId].status === 'playing') return m.reply(`Partita già in corso.`);
        if (trisSessions[roomId].p1 === senderId) return m.reply(`Non puoi giocare contro te stesso!`);

        trisSessions[roomId].p2 = senderId;
        trisSessions[roomId].status = 'playing';

        return conn.sendMessage(chatId, { 
            text: `🎮 Partita Iniziata!\n❌ @${trisSessions[roomId].p1.split('@')[0]}\n⭕ @${senderId.split('@')[0]}\n\n${renderBoard(trisSessions[roomId].board)}\n\nTocca a @${trisSessions[roomId].p1.split('@')[0]}!`,
            mentions: [trisSessions[roomId].p1, senderId]
        });
    }

    // --- GESTIONE MOSSE (Solo per i giocatori nella stanza) ---
    let activeRoom = Object.values(trisSessions).find(s => 
        (s.p1 === senderId || s.p2 === senderId) && s.status === 'playing'
    );

    if (activeRoom && /^[1-9]$/.test(text)) {
        let roomId = chatId + activeRoom.name;
        if (activeRoom.turn !== senderId) return; // Ignora se non è il suo turno

        let move = parseInt(text) - 1;
        if (activeRoom.board[move] !== null) return m.reply('Casella occupata!');

        activeRoom.board[move] = (senderId === activeRoom.p1) ? 'X' : 'O';
        let result = checkWinner(activeRoom.board);

        if (result) {
            let finalMsg = renderBoard(activeRoom.board) + "\n\n";
            finalMsg += result === 'Pareggio' ? "🤝 Pareggio!" : `🏆 Vince @${(result === 'X' ? activeRoom.p1 : activeRoom.p2).split('@')[0]}!`;
            await conn.sendMessage(chatId, { text: finalMsg, mentions: [activeRoom.p1, activeRoom.p2] });
            delete trisSessions[roomId];
        } else {
            activeRoom.turn = (senderId === activeRoom.p1) ? activeRoom.p2 : activeRoom.p1;
            await conn.sendMessage(chatId, { 
                text: `${renderBoard(activeRoom.board)}\nTocca a @${activeRoom.turn.split('@')[0]}`,
                mentions: [activeRoom.turn]
            });
        }
    }
};

handler.help = ['tris', 'entratris'];
handler.tags = ['games'];
handler.command = /^(tris|entratris)$/i;

export default handler;
