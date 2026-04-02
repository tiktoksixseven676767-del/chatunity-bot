global.trisSessions = global.trisSessions || {};

let handler = m => m;

handler.before = async function (m, { conn }) {
    // 1. Filtro: il messaggio deve essere un numero 1-9 in risposta al bot
    if (!m.quoted || !m.text || !/^[1-9]$/.test(m.text.trim())) return;
    if (!m.quoted.fromMe) return;

    const chatId = m.chat;
    const senderId = m.sender;
    const move = parseInt(m.text.trim()) - 1;

    // 2. Trova la sessione attiva collegata a quel messaggio
    let roomId = Object.keys(global.trisSessions).find(id => 
        id.startsWith(chatId) && global.trisSessions[id].lastMsg === m.quoted.id
    );

    if (!roomId) return;
    let s = global.trisSessions[roomId];

    // 3. Controlli di sicurezza (stato, turno, casella)
    if (s.status !== 'playing') return;
    if (s.turn !== senderId) return m.reply(`⏳ Non è il tuo turno! Aspetta @${s.turn.split('@')[0]}`);
    if (s.board[move]) return m.reply('❌ Casella già occupata! Scegline un\'altra.');

    // 4. Registra la mossa (X per p1, O per p2)
    s.board[move] = (senderId === s.p1) ? 'X' : 'O';

    // Funzione per disegnare la griglia testuale
    const render = (b) => {
        const em = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
        let out = "";
        for (let i = 0; i < 9; i++) {
            out += b[i] ? (b[i] === 'X' ? '❌' : '⭕') : em[i];
            out += (i + 1) % 3 === 0 ? "\n" : "  ";
        }
        return out;
    };

    // Funzione per controllare la vittoria
    const check = (b) => {
        const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        for (let [a, b_idx, c] of wins) {
            if (b[a] && b[a] === b[b_idx] && b[a] === b[c]) return b[a];
        }
        return b.includes(null) ? null : 'Pareggio';
    };

    let result = check(s.board);

    // 5. GESTIONE FINALE (Vittoria o Pareggio)
    if (result) {
        let finalStr = `${render(s.board)}\n\n`;
        
        if (result === 'Pareggio') {
            finalStr += "🤝 *PAREGGIO!* La sfida finisce qui senza vincitori.";
        } else {
            let winnerId = (result === 'X' ? s.p1 : s.p2);
            
            // --- ACCREDITO PREMIO 500 UC ---
            global.db.data.users = global.db.data.users || {};
            if (!global.db.data.users[winnerId]) global.db.data.users[winnerId] = { limit: 0, exp: 0 };
            
            // Aggiunge 500 al saldo (limit) del vincitore
            global.db.data.users[winnerId].limit = (global.db.data.users[winnerId].limit || 0) + 500;
            
            finalStr += `🏆 *VITTORIA!* @${winnerId.split('@')[0]} ha vinto la partita!\n💰 Premio: *500 UC* accreditati sul tuo profilo!`;
        }

        // Messaggio finale con immagine Globo
        await conn.sendMessage(chatId, { 
            image: { url: 'https://www.globo.it/wp-content/uploads/2018/12/Il-gioco-del-tris-1536x1025.jpg' },
            caption: finalStr, 
            mentions: [s.p1, s.p2] 
        }, { quoted: m });

        delete global.trisSessions[roomId];
    } else {
        // 6. CONTINUAZIONE (Cambio turno)
        s.turn = (senderId === s.p1) ? s.p2 : s.p1;

        // Invia la griglia aggiornata con l'immagine della lavagna
        let newMsg = await conn.sendMessage(chatId, { 
            image: { url: 'https://data.family-nation.it/imgprodotto/jaq-jaq-bird-lavagnetta-giochi-da-viaggio-games-5in1-con-gessetti-zero-polvere-tris-e-4-altri-giochi-classici-lavagnette_67738.jpg' },
            caption: `🎮 Stanza: *${s.name}*\n\n${render(s.board)}\n\nTocca a @${s.turn.split('@')[0]}\n*(Rispondi con un numero)*`,
            mentions: [s.turn]
        }, { quoted: m });

        // Aggiorna l'ID del messaggio per la prossima mossa
        s.lastMsg = newMsg.key.id;
    }
    return true;
};

export default handler;
