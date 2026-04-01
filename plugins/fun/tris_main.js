// Usiamo un oggetto globale per condividere i dati tra i due file
global.trisSessions = global.trisSessions || {};

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const chatId = m.chat;
    const senderId = m.sender;

    // --- COMANDO .tris <nome> ---
    if (command === 'tris') {
        if (!text) return m.reply(`Indica un nome per la stanza!\nEsempio: *${usedPrefix}tris sfida1*`);
        let roomName = text.toLowerCase().trim();
        let roomId = chatId + roomName;

        if (global.trisSessions[roomId]) return m.reply(`La stanza *${roomName}* è già attiva.`);

        global.trisSessions[roomId] = {
            name: roomName,
            board: Array(9).fill(null),
            p1: senderId,
            p2: null,
            turn: senderId,
            status: 'waiting',
            lastMsg: null
        };

        // Auto-distruzione dopo 5 minuti
        setTimeout(() => {
            if (global.trisSessions[roomId] && global.trisSessions[roomId].status === 'waiting') {
                conn.sendMessage(chatId, { text: `⏰ Stanza *${roomName}* eliminata per inattività.` });
                delete global.trisSessions[roomId];
            }
        }, 5 * 60 * 1000);

        return m.reply(`🎮 Stanza *${roomName}* creata!\nSfidante, rispondi con: *.entratris ${roomName}*`);
    }

    // --- COMANDO .entratris <nome> ---
    if (command === 'entratris') {
        if (!text) return m.reply(`Specifica il nome della stanza.`);
        let roomName = text.toLowerCase().trim();
        let roomId = chatId + roomName;
        let s = global.trisSessions[roomId];

        if (!s) return m.reply(`La stanza *${roomName}* non esiste.`);
        if (s.status === 'playing') return m.reply(`Partita già in corso.`);
        if (s.p1 === senderId) return m.reply(`Non puoi sfidare te stesso.`);

        s.p2 = senderId;
        s.status = 'playing';

        const em = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
        let boardTxt = "";
        for (let i = 0; i < 9; i++) {
            boardTxt += em[i] + ((i + 1) % 3 === 0 ? "\n" : "  ");
        }

        let msg = await conn.sendMessage(chatId, { 
            text: `🎮 Sfida Iniziata in *${roomName}*!\n❌ @${s.p1.split('@')[0]}\n⭕ @${senderId.split('@')[0]}\n\n${boardTxt}\n\nTocca a @${s.p1.split('@')[0]}!\n\n*(Rispondi a questo messaggio con un numero)*`,
            mentions: [s.p1, senderId]
        });
        s.lastMsg = msg.key.id;
    }
};

handler.help = ['tris', 'entratris'];
handler.tags = ['games'];
handler.command = /^(tris|entratris)$/i;

export default handler;
