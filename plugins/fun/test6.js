const yts = require('yt-search');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`🎵 Cosa vuoi ascoltare?\nEs: *${usedPrefix + command} Neon Shiva*`);

    try {
        await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

        const search = await yts(text);
        const video = search.videos[0];

        if (!video) return m.reply('❌ Nessun risultato trovato.');

        const { title, thumbnail, timestamp, url, author } = video;

        let caption = `🎧 *YT PLAY*\n\n📌 *Titolo:* ${title}\n⏱️ *Durata:* ${timestamp}\n👤 *Canale:* ${author.name}\n🔗 *Link:* ${url}`;

        await conn.sendMessage(m.chat, { 
            image: { url: thumbnail }, 
            caption: caption 
        }, { quoted: m });

        // Utilizzo di un'API pubblica per il download diretto in MP3
        const audioUrl = `https://api.vyt-s.xyz/dl?url=${encodeURIComponent(url)}&type=mp3`;

        await conn.sendMessage(m.chat, { 
            audio: { url: audioUrl }, 
            mimetype: 'audio/mpeg', 
            fileName: `${title}.mp3`
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error(e);
        m.reply('❗ Errore durante la riproduzione. Verifica la connessione.');
    }
};

handler.help = ['play'];
handler.tags = ['music'];
handler.command = /^(playtest|yt)$/i;

module.exports = handler;
