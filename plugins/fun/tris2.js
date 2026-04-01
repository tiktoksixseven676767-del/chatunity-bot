let trisSessions = {};

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const chatId = m.chat; // ID della conversazione (gruppo o privato)
    const senderId = m.sender;

    // --- COMANDO PER CREARE O ENTRARE ---
    if (command === 'tris') {
        if (!text) return m.reply(`Indica il nome della stanza! Esempio:\n*${usedPrefix + command} ciao*`);
        let roomName = text.toLowerCase().trim();
        let roomId = chatId + roomName; // Stanza unica per quel gruppo

        if (trisSessions[roomId]) return m.reply(`La stanza *${roomName}* esiste già. Usa *${usedPrefix}entratris ${roomName}*`);

        trisSessions[roomId] = {
            name: roomName,
            board: Array(9).fill(null),
            p1: senderId,
            p2: null,
            turn: senderId,
            status: 'waiting'
        };
        return m.reply(`🎮 Stanza *${roomName}* creata!\nIn attesa del secondo giocatore...\nDigita *${usedPrefix}entratris ${roomName}* per sfidare ${await conn.getName(senderId)}`);
    }

    if (command === 'entratris') {
        if (!text) return m.reply(`Indica il nome della stanza in cui vuoi entrare!`);
        let roomName = text.toLowerCase().trim();
        let roomId = chatId + roomName;

        if (!trisSessions[roomId]) return m.reply(`La stanza *${roomName}* non esiste.`);
        if (trisSessions[roomId].p2) return m.reply(`La stanza è già piena.`);
        if (trisSessions[roomId].p1 === senderId) return m.reply(`Non puoi sfidare te stesso!`);

        trisSessions[roomId].p2 = senderId;
        trisSessions[roomId].status = 'playing';

        let boardTxt = renderBoard(trisSessions[roomId].board);
        return conn.sendMessage(chatId, { 
            text: `🎮 Sfida Iniziata!\n*${await conn.getName(trisSessions[roomId].p1)}* (❌) vs *${await conn.getName(senderId)}* (⭕)\n\n${boardTxt}\n\nTocca a @${trisSessions[roomId].p1.split('@')[0]}!`,
            mentions: [trisSessions[roomId].p1, trisSessions[roomId].p2]
        });
    }

    // --- LOGICA DI GIOCO (solo se l'utente invia un numero) ---
    // Cerchiamo se l'utente è in una partita attiva in questo gruppo
    let activeRoomId = Object.keys(trisSessions).find(id => 
        id.startsWith(chatId) && 
        (trisSessions[id].p1 === senderId || trisSessions[id].p2 === senderId) && 
        trisSessions[id].status === 'playing'
    );

    if (activeRoomId && /^[1-9]$/.test(text)) {
        let session = trisSessions[activeRoomId];

        // Controllo turno
        if (session.turn !== senderId) return m.reply(`Non è il tuo turno! Aspetta @${session.turn.split('@')[0]}`, null, { mentions: [session.turn] });

        let move = parseInt(text) - 1;
        if (session.board[move] !== null) return m.reply('Casella già occupata!');

        // Assegna il segno
        session.board[move] = (senderId === session.p1) ? 'X' : 'O';
        
        // Controllo vittoria
        let winnerMark = checkWinner(session.board);
        if (winnerMark) {
            let msg = renderBoard(session.board) + "\n\n";
            if (winnerMark === 'Pareggio') msg += "🤝 *Pareggio!*";
            else {
                let winnerId = (winnerMark === 'X') ? session.p1 : session.p2;
                msg += `🏆 *IL VINCITORE È @${winnerId.split('@')[0]}!*`;
            }
            await conn.sendMessage(chatId, { text: msg, mentions: [session.p1, session.p2] });
            delete trisSessions[activeRoomId];
            return;
        }

        // Cambio turno
        session.turn = (senderId === session.p1) ? session.p2 : session.p1;
        await conn.sendMessage(chatId, { 
            text: `${renderBoard(session.board)}\nTocca a @${session.turn.split('@')[0]}`,
            mentions: [session.turn]
        });
    }
};

// Funzioni spostate all'interno per evitare l'errore "Illegal return" in alcuni ambienti
function renderBoard(board) {
    let text = "";
    for (let i = 0; i < 9; i++) {
        text += board[i] ? (board[i] === 'X' ? '❌' : '⭕') : ` ${i + 1}️ `;
        if ((i + 1) % 3 === 0) text += "\n";
    }
    return text;
}

function checkWinner(b) {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let [a, b_idx, c] of wins) {
        if (b[a] && b[a] === b[b_idx] && b[a] === b[c]) return b[a];
    }
    return b.includes(null) ? null : 'Pareggio';
}

handler.help = ['tris <nome>', 'entratris <nome>'];
handler.tags = ['games'];
handler.command = /^(tris|entratris)$/i;
handler.group = true; // Solo nei gruppi per il multiplayer

export default handler;
