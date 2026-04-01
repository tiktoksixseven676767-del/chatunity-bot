let trisSessions = {};

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const chatId = m.chat;
    const senderId = m.sender;

    // Se l'utente vuole resettare o forzare la chiusura
    if (text === 'reset' || text === 'stop') {
        delete trisSessions[chatId];
        return m.reply('🎮 Partita di Tris terminata.');
    }

    // Se non c'è una sessione attiva, inizializzala
    if (!trisSessions[chatId]) {
        trisSessions[chatId] = {
            board: Array(9).fill(null),
            turn: senderId,
            status: 'playing'
        };
        return m.reply(`🎮 *TRIS INIZIATO*\n\n${renderBoard(trisSessions[chatId].board)}\n\nInvia un numero da *1 a 9* per fare la tua mossa.\nUsa *${usedPrefix + command} stop* per annullare.`);
    }

    let session = trisSessions[chatId];

    // Gestione mossa
    let move = parseInt(text) - 1;
    if (isNaN(move) || move < 0 || move > 8 || session.board[move] !== null) {
        return m.reply('❌ Mossa non valida. Scegli un numero da 1 a 9 tra le caselle libere.');
    }

    // Mossa del giocatore (X)
    session.board[move] = 'X';

    // Controllo vittoria giocatore
    let result = checkWinner(session.board);
    if (result) return finishGame(chatId, conn, m, result);

    // Mossa del Bot (O) - Logica semplice: prima casella libera
    let emptyCells = session.board.map((v, i) => v === null ? i : null).filter(v => v !== null);
    if (emptyCells.length > 0) {
        let cpuMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        session.board[cpuMove] = 'O';
    }

    // Controllo vittoria Bot
    result = checkWinner(session.board);
    if (result) return finishGame(chatId, conn, m, result);

    // Mostra scacchiera aggiornata
    await m.reply(renderBoard(session.board) + `\n\nTocca a te! Scegli la prossima mossa.`);
};

// Funzioni di supporto
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

async function finishGame(chatId, conn, m, winner) {
    let session = trisSessions[chatId];
    let msg = renderBoard(session.board) + "\n\n";
    if (winner === 'Pareggio') msg += "🤝 *Pareggio!*";
    else msg += winner === 'X' ? "🏆 *Hai vinto tu!*" : "💀 *Ha vinto il bot!*";
    
    await m.reply(msg);
    delete trisSessions[chatId];
}

handler.help = ['tris', 'tris stop'];
handler.tags = ['games'];
handler.command = /^(tris|tictactoe)$/i;

export default handler;
