let trisSessions = {};

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const chatId = m.chat;
    const senderId = m.sender;
    const msgContent = m.body ? m.body.trim() : "";

    // --- FUNZIONI INTERNE ---
    const renderBoard = (board) => {
        const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
        let res = "";
        for (let i = 0; i < 9; i++) {
            if (board[i] === 'X') res += '❌';
            else if (board[i] === 'O') res += '⭕';
            else res += emojis[i];
            if ((i + 1) % 3 === 0) res += "\n";
            else res += "  "; 
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

    const setRoomTimeout = (roomId) => {
        if (trisSessions[roomId]?.timeout) clearTimeout(trisSessions[roomId].timeout);
        trisSessions[roomId].timeout = setTimeout(() => {
            if (trisSessions[roomId]) {
                conn.sendMessage(chatId, { text: `⏰ La stanza *${trisSessions[roomId].name}* è stata chiusa.` });
                delete trisSessions[roomId];
            }
        }, 5 * 60 * 1000);
    };

    // --- COMANDO .tris ---
    if (command === 'tris') {
        if (!text) return m.reply(`Indica il nome della stanza!\nEsempio: *${usedPrefix + command} ciao*`);
        let roomName = text.toLowerCase().trim();
        let roomId = chatId + roomName;
        if (trisSessions[roomId]) return m.reply(`La stanza *${roomName}* esiste già.`);

        trisSessions[roomId] = {
            name: roomName,
            board: Array(9).fill(null),
            p1: senderId,
            p2: null,
            turn: senderId,
            status: 'waiting'
        };
        setRoomTimeout(roomId);
        return m.reply(`🎮 Stanza *${roomName}* creata!\n\nUsa *${usedPrefix}entratris ${roomName}*`);
    }

    // --- COMANDO .entratris ---
    if (command === 'entratris') {
        let roomName = text.toLowerCase().trim();
        let roomId = chatId + roomName;
        if (!trisSessions[roomId]) return m.reply(`Stanza non trovata.`);
        if (trisSessions[roomId].p1 === senderId) return m.reply(`Non puoi giocare contro te stesso.`);

        trisSessions[roomId].p2 = senderId;
        trisSessions[roomId].status = 'playing';
        setRoomTimeout(roomId);

        return conn.sendMessage(chatId, { 
            text: `🎮 Sfida Iniziata!\n❌ @${trisSessions[roomId].p1.split('@')[0]}\n⭕ @${senderId.split('@')[0]}\n\n${renderBoard(trisSessions[roomId].board)}\n\nTocca a @${trisSessions[roomId].p1.split('@')[0]}!`,
            mentions: [trisSessions[roomId].p1, senderId]
        });
    }

    // --- LOGICA MOSSE (SENZA PREFISSO) ---
    // Cerchiamo una sessione dove l'utente è presente e la partita è 'playing'
    let activeRoomId = Object.keys(trisSessions).find(id => 
        id.startsWith(chatId) && 
        (trisSessions[id].p1 === senderId || trisSessions[id].p2 === senderId) && 
        trisSessions[id].status === 'playing'
    );

    if (activeRoomId && /^[1-9]$/.test(msgContent)) {
        let session = trisSessions[activeRoomId];
        if (session.turn !== senderId) return; // Non è il tuo turno, ignoro silenziosamente

        let move = parseInt(msgContent) - 1;
        if (session.board[move] !== null) return m.reply('Casella già occupata!');

        session.board[move] = (senderId === session.p1) ? 'X' : 'O';
        let result = checkWinner(session.board);

        if (result) {
            let finalMsg = renderBoard(session.board) + "\n\n";
            finalMsg += result === 'Pareggio' ? "🤝 Pareggio!" : `🏆 Vince @${(result === 'X' ? session.p1 : session.p2).split('@')[0]}!`;
            await conn.sendMessage(chatId, { text: finalMsg, mentions: [session.p1, session.p2] });
            clearTimeout(session.timeout);
            delete trisSessions[activeRoomId];
        } else {
            session.turn = (senderId === session.p1) ? session.p2 : session.p1;
            setRoomTimeout(activeRoomId);
            await conn.sendMessage(chatId, { 
                text: `${renderBoard(session.board)}\nTocca a @${session.turn.split('@')[0]}`,
                mentions: [session.turn]
            });
        }
    }
};

handler.help = ['tris', 'entratris'];
handler.tags = ['games'];
handler.command = /^(tris|entratris)$/i;
// Questa riga è fondamentale: permette al plugin di leggere anche i messaggi senza il punto
handler.all = async function (m) {
    if (!m.body || !/^[1-9]$/.test(m.body)) return;
    return handler.call(this, m, { conn: this, text: m.body, usedPrefix: '.', command: '' });
};

export default handler;
