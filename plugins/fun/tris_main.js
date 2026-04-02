global.trisSessions = global.trisSessions || {};

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const chatId = m.chat;
    const senderId = m.sender;

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

        // 🖼️ Immagine GLOBO (Creazione stanza)
        await conn.sendMessage(chatId, { 
            image: { url: 'https://www.globo.it/wp-content/uploads/2018/12/Il-gioco-del-tris-1536x1025.jpg' },
            caption: `🎮 Stanza *${roomName}* creata da @${senderId.split('@')[0]}!\n\nSfidante, scrivi: *.entratris ${roomName}*`,
            mentions: [senderId]
        }, { quoted: m });

        setTimeout(() => {
            if (global.trisSessions[roomId] && global.trisSessions[roomId].status === 'waiting') {
                conn.sendMessage(chatId, { text: `⏰ Stanza *${roomName}* chiusa per inattività.` });
                delete global.trisSessions[roomId];
            }
        }, 5 * 60 * 1000);
        return;
    }

    if (command === 'entratris') {
        if (!text) return m.reply(`Specifica il nome della stanza.`);
        let roomName = text.toLowerCase().trim();
        let roomId = chatId + roomName;
        let s = global.trisSessions[roomId];

        if (!s) return m.reply(`Stanza non trovata.`);
        if (s.status === 'playing') return m.reply(`Partita già in corso.`);
        if (s.p1 === senderId) return m.reply(`Non puoi giocare da solo.`);

        s.p2 = senderId;
        s.status = 'playing';

        const em = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
        let boardTxt = "";
        for (let i = 0; i < 9; i++) {
            boardTxt += em[i] + ((i + 1) % 3 === 0 ? "\n" : "  ");
        }

        // 📝 Immagine VECTEEZY (Al posto della GIF per l'inizio sfida)
        let msg = await conn.sendMessage(chatId, { 
            image: { url: 'https://static.vecteezy.com/ti/vettori-gratis/p1/6409900-tic-tac-toe-sketched-isolato-gioco-vintage-in-stile-disegnato-a-mano-vettoriale.jpg' },
            caption: `🎮 Sfida Iniziata in *${roomName}*!\n❌ @${s.p1.split('@')[0]}\n⭕ @${senderId.split('@')[0]}\n\n${boardTxt}\n\nTocca a @${s.p1.split('@')[0]}!\n\n*(Rispondi con un numero)*`,
            mentions: [s.p1, senderId]
        }, { quoted: m });
        
        s.lastMsg = msg.key.id;
    }
};

handler.command = /^(tris|entratris)$/i;
export default handler;
