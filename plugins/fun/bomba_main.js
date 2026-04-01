global.bombaSessions = global.bombaSessions || {};

let handler = async (m, { conn, usedPrefix, command }) => {
    const chatId = m.chat;
    const senderId = m.sender;

    if (global.bombaSessions[chatId]) return m.reply("💣 C'è già una bomba attiva in questo gruppo!");

    let lettere = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V'];
    let letteraScelta = lettere[Math.floor(Math.random() * lettere.length)];
    let durata = Math.floor(Math.random() * (40 - 20 + 1)) + 20; 

    global.bombaSessions[chatId] = {
        lettera: letteraScelta,
        possessore: senderId,
        scadenza: Date.now() + (durata * 1000),
        status: 'attiva',
        lastMsg: null
    };

    // Immagine statica bomba (quella che hai inviato)
    let msg = await conn.sendMessage(chatId, {
        image: { url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTexd43eGKtfEcZLKXSl7C3dxma5khrl4A35k3ycAh5yQ&s=10' }, 
        caption: `💣 *PASSA LA BOMBA!* 💣\n\nLa bomba è in mano a @${senderId.split('@')[0]}\n\n✨ Sfida: Scrivi una parola che inizia con la lettera: *${letteraScelta}*\n\n⏳ Sbrigati! La miccia brucia!`,
        mentions: [senderId]
    }, { quoted: m });

    global.bombaSessions[chatId].lastMsg = msg.key.id;

    // Timer Esplosione
    setTimeout(async () => {
        if (global.bombaSessions[chatId]) {
            let finale = global.bombaSessions[chatId];
            // GIF Esplosione Nucleare Tenor
            await conn.sendMessage(chatId, {
                video: { url: 'https://media.tenor.com/ehGe2R5USNcAAAAM/nuclear-bomb.gif' }, 
                gifPlayback: true,
                caption: `💥 *BOOOOM!* 💥\n\nLa bomba è esplosa in mano a @${finale.possessore.split('@')[0]}!\n💀 Sei stato polverizzato!`,
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
