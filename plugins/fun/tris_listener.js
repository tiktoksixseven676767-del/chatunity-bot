global.trisSessions = global.trisSessions || {};

let handler = m => m;

handler.before = async function (m, { conn }) {
    if (!m.quoted || !m.text || !/^[1-9]$/.test(m.text.trim())) return;
    if (!m.quoted.fromMe) return;

    const chatId = m.chat;
    const senderId = m.sender;
    const move = parseInt(m.text.trim()) - 1;

    // Recupera la sessione tramite l'ID del messaggio quotato
    let roomId = Object.keys(global.trisSessions).find(id => 
        id.startsWith(chatId) && global.trisSessions[id].lastMsg === m.quoted.id
    );

    if (!roomId) return;
    let s = global.trisSessions[roomId];

    // Controlli di turno e stato
    if (s.status !== 'playing') return;
    if (s.turn !== senderId) return m.reply(` Richards! Tocca a @${s.turn.split('@')[0]}`);
    if (s.board[move]) return m.reply('Casella già occupata!');

    // Registra la mossa
    s.board[move] = (senderId === s.p1) ? 'X' : 'O';

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
        let finalStr = `${render(s.board)}\n\n`;
        
        if (result === 'Pareggio') {
            finalStr += "🤝 *PAREGGIO!* Nessun premio assegnato.";
        } else {
            let winnerId = (result === 'X' ? s.p1 : s.p2);
            
            // --- ACCREDITO 500 UC ---
            global.db.data.users = global.db.data.users || {};
            if (!global.db.data.users[winnerId]) global.db.data.users[winnerId] = { limit: 0, exp: 0 };
            
            global.db.data.users[winnerId].limit = (global.db.data.users[winnerId].limit || 0) + 500;
            
            finalStr += `🏆 *VITTORIA!* @${winnerId.split('@')[0]} vince la sfida!\n💰 Premio: *500 UC* accreditati.`;
        }

        await conn.sendMessage(chatId, { 
            image: { url: 'https://www.globo.it/wp-content/uploads/2018/12/Il-gioco-del-tris-1536x1025.jpg' },
            caption: finalStr, 
            mentions: [s.p1, s.p2] 
        }, { quoted: m });

        delete global.trisSessions[roomId];
    } else {
        // Cambio turno
        s.turn = (senderId === s.p1) ? s.p2 : s.p1;

        // Messaggio del turno successivo con immagine lavagna
        let newMsg = await conn.sendMessage(chatId, { 
            image: { url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRVUMsSAXKKyAJ6VWjoFm513LwyW3w4Mv_eAbd1IONYA&s=10' },
            caption: `🎮 Stanza: *${s.name}*\n\n${render(s.board)}\n\nTocca a @${s.turn.split('@')[0]}`,
            mentions: [s.turn]
        }, { quoted: m });

        s.lastMsg = newMsg.key.id;
    }
    return true;
};

export default handler;