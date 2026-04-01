global.bombaSessions = global.bombaSessions || {};

let handler = async (m, { conn, usedPrefix, command }) => {
    const chatId = m.chat;
    const senderId = m.sender;

    if (global.bombaSessions[chatId]) return m.reply("💣 C'è già una bomba attiva in questo gruppo!");

    // Configurazione bomba
    let lettere = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V'];
    let letteraScelta = lettere[Math.floor(Math.random() * lettere.length)];
    let durata = Math.floor(Math.random() * (45 - 20 + 1)) + 20; // Tra 20 e 45 secondi

    global.bombaSessions[chatId] = {
        lettera: letteraScelta,
        possessore: senderId,
        scadenza: Date.now() + (durata * 1000),
        status: 'attiva',
        lastMsg: null
    };

    let msg = await conn.sendMessage(chatId, {
        video: { url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueGZ3bmZ3bmZ3bmZ3bmZ3bmZ3bmZ3bmZ3bmZ3bmZ3bmZ3bmZ3JmVwPXYxX2ludGVybmFsX2dpZl9ieV9iZCZjdD1n/f6V2vT8DhsTjW/giphy.gif' },
        gifPlayback: true,
        caption: `💣 *PASSA LA BOMBA!* 💣\n\nLa bomba è in mano a @${senderId.split('@')[0]}\n\n✨ Sfida: Scrivi una parola che inizia con la lettera: *${letteraScelta}*\n\n⏳ Sbrigati! La miccia è corta!`,
        mentions: [senderId]
    }, { quoted: m });

    global.bombaSessions[chatId].lastMsg = msg.key.id;

    // Timer per l'esplosione
    setTimeout(async () => {
        if (global.bombaSessions[chatId]) {
            let finale = global.bombaSessions[chatId];
            await conn.sendMessage(chatId, {
                video: { url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueGZ3bmZ3bmZ3bmZ3bmZ3bmZ3bmZ3bmZ3bmZ3bmZ3bmZ3bmZ3JmVwPXYxX2ludGVybmFsX2dpZl9ieV9iZCZjdD1n/f6V2vT8DhsTjW/giphy.gif' }, // Puoi metterne una di esplosione qui
                gifPlayback: true,
                caption: `💥 *BOOOOM!* 💥\n\nLa bomba è esplosa in mano a @${finale.possessore.split('@')[0]}!\n💀 HAI PERSO!`,
                mentions: [finale.possessore]
            });
            delete global.bombaSessions[chatId];
        }
    }, durata * 1000);
};

handler.help = ['bomba'];
handler.tags = ['games'];
handler.command = /^(bomba)$/i;

export default handler;
