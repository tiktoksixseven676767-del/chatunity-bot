const yts = require('yt-search');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // 1. Controllo se l'utente ha scritto qualcosa
    if (!text) return m.reply(`🎵 Quale canzone vuoi ascoltare?\nEs: *${usedPrefix + command} Paradise Coldplay*`);

    try {
        // Reazione di ricerca
        await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

        // 2. Ricerca su YouTube
        const search = await yts(text);
        const video = search.videos[0]; // Prende il primo risultato

        if (!video) return m.reply('❌ Non ho trovato nulla su YouTube.');

        const { title, description, thumbnail, timestamp, views, url, author } = video;

        let infoCanzone = `🎧 *YOUTUBE PLAY*\n\n` +
                          `📌 *Titolo:* ${title}\n` +
                          `⏱️ *Durata:* ${timestamp}\n` +
                          `👤 *Canale:* ${author.name}\n` +
                          `👁️ *Visualizzazioni:* ${views.toLocaleString()}\n\n` +
                          `🔗 *Link:* ${url}\n\n` +
                          `_Sto caricando l'audio, attendi..._`;

        // 3. Invio della miniatura con i dettagli
        await conn.sendMessage(m.chat, { 
            image: { url: thumbnail }, 
            caption: infoCanzone 
        }, { quoted: m });

        // 4. Invio del file Audio
        // NOTA: Qui il bot invia l'audio. Se il tuo bot ha già un convertitore interno 
        // (come y2mate o un server dedicato), usalo qui. 
        // In questo esempio usiamo una funzione standard di invio audio via URL.
        
        await conn.sendMessage(m.chat, { 
            audio: { url: `https://api.vyt-s.xyz/dl?url=${url}&type=mp3` }, // Esempio di API di download
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`
        }, { quoted: m });

        // Reazione di successo
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error(e);
        m.reply('❗ Si è verificato un errore durante la riproduzione.');
    }
};

handler.help = ['play <titolo>'];
handler.tags = ['music'];
handler.command = /^(playtest|yt|musica)$/i;

module.exports = handler;
