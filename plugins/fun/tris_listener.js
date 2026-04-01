global.trisSessions = global.trisSessions || {};

let handler = m => m;

handler.before = async function (m, { conn }) {
    // Controlla se il messaggio è un numero 1-9 in risposta a un messaggio del bot
    if (!m.quoted || !m.text || !/^[1-9]$/.test(m.text.trim())) return;
    if (!m.quoted.fromMe) return;

    const chatId = m.chat;
    const senderId = m.sender;
    const move = parseInt(m.text.trim()) - 1;

    // Cerca la stanza tramite l'ID del messaggio citato
    let roomId = Object.keys(global.trisSessions).find(id => 
        id.startsWith(chatId) && global.trisSessions[id].lastMsg === m.quoted.id
    );

    if (!roomId) return;
    let s = global.trisSessions[roomId];

    if (s.status !== 'playing' || s.turn !== senderId) return;
    if (s.board[move]) return m.reply('Casella occupata!');

    // Esegui mossa
    s.board[move] = (senderId === s.p1) ? 'X' : 'O';

    // Funzioni di rendering interne
    const render = (b) => {
        const em = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
        let out = "";
        for (let i = 0; i < 9; i++) {
            out += b[i] ? (b[i] === 'X' ? '❌' : '⭕') : em[i];
            out += (i + 1) % 3 === 0 ? "\n" : "  ";
        }
        return out;
    };

    const check = (b) => {
        const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        for (let [a, b_idx, c] of wins) {
            if (b[a] && b[a] === b[b_idx] && b[a] === b[c]) return b[a];
        }
        return b.includes(null) ? null : 'Pareggio';
    };

    let result = check(s.board);
    if (result) {
        let finalStr = `${render(s.board)}\n\n` + (result === 'Pareggio' ? "🤝 Pareggio!" : `🏆 @${(result === 'X' ? s.p1 : s.p2).split('@')[0]} ha vinto la partita!`);
        
        // Immagine Globo per la vittoria/fine
        await conn.sendMessage(chatId, { 
            image: { url: 'https://www.globo.it/wp-content/uploads/2018/12/Il-gioco-del-tris-1536x1025.jpg' },
            caption: finalStr, 
            mentions: [s.p1, s.p2] 
        });
        delete global.trisSessions[roomId];
    } else {
        s.turn = (senderId === s.p1) ? s.p2 : s.p1;
        
        // GIF per ogni turno di gioco
        let newMsg = await conn.sendMessage(chatId, { 
            video: { url: 'https://raw.githubusercontent.com/Fokusid/Database/main/Games/tris.gif' },
            gifPlayback: true,
            caption: `🎮 Stanza: *${s.name}*\n\n${render(s.board)}\n\nTocca a @${s.turn.split('@')[0]}\n*(Rispondi con un numero)*`,
            mentions: [s.turn]
        }, { quoted: m });
        
        s.lastMsg = newMsg.key.id; // Aggiorna l'ID per la prossima risposta
    }
    return true;
};

export default handler;
