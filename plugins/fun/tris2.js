// Oggetto globale per gestire le sessioni attive
const trisSessions = new Map();

/**
 * .tris - Comando per giocare a Tris senza API
 * Linguaggio: Node.js
 */

const renderBoard = (board) => {
    let text = "🎮 *SFIDA A TRIS* 🎮\n\n";
    const icons = board.map((cell, i) => cell === 'X' ? '❌' : (cell === 'O' ? '⭕' : `*${i + 1}*`));
    
    text += `${icons[0]} | ${icons[1]} | ${icons[2]}\n`;
    text += `---+---+---\n`;
    text += `${icons[3]} | ${icons[4]} | ${icons[5]}\n`;
    text += `---+---+---\n`;
    text += `${icons[6]} | ${icons[7]} | ${icons[8]}\n\n`;
    return text;
};

const checkWinner = (b) => {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let [a, b_idx, c] of wins) {
        if (b[a] && b[a] === b[b_idx] && b[a] === b[c]) return b[a];
    }
    return b.includes(null) ? null : 'tie';
};

// Esempio di integrazione nel tuo handler
// if (cmd === 'tris') {

if (trisSessions.has(m.chat)) {
    return client.sendMessage(m.chat, { text: "❌ C'è già una partita in corso in questa chat!" });
}

trisSessions.set(m.chat, {
    board: Array(9).fill(null),
    turn: m.sender, // Chi lancia il comando inizia per primo
    players: [m.sender], // Puoi aggiungere logica per il secondo giocatore
    active: true,
    lastMove: Date.now()
});

const game = trisSessions.get(m.chat);
await client.sendMessage(m.chat, { 
    text: renderBoard(game.board) + "Tocca a te! Invia il numero della casella (1-9)." 
});

// } 

// Logica di risposta (da mettere dove gestisci i messaggi in arrivo)
// Se il messaggio è un numero e c'è una sessione attiva...
if (!isNaN(m.body) && trisSessions.has(m.chat)) {
    const session = trisSessions.get(m.chat);
    const move = parseInt(m.body) - 1;

    if (move >= 0 && move <= 8 && !session.board[move]) {
        session.board[move] = 'X'; // Qui puoi alternare X e O se implementi il multiplayer
        const winner = checkWinner(session.board);

        if (winner) {
            let result = renderBoard(session.board);
            result += winner === 'tie' ? "🤝 Pareggio!" : "🏆 Hai vinto!";
            await client.sendMessage(m.chat, { text: result });
            trisSessions.delete(m.chat);
        } else {
            // Qui potresti inserire una mossa automatica del bot (CPU) 
            // per rendere il gioco "Single Player" senza API
            const emptyCells = session.board.map((v, i) => v === null ? i : null).filter(v => v !== null);
            const cpuMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            session.board[cpuMove] = 'O';

            const cpuWinner = checkWinner(session.board);
            if (cpuWinner) {
                await client.sendMessage(m.chat, { text: renderBoard(session.board) + "💀 Ha vinto il bot!" });
                trisSessions.delete(m.chat);
            } else {
                await client.sendMessage(m.chat, { text: renderBoard(session.board) + "Tocca a te!" });
            }
        }
    }
}
