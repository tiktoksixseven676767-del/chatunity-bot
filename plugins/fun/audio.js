import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`✨ *Esempio d'uso:*\n${usedPrefix + command} https://www.youtube.com/watch?v=dQw4w9WgXcQ`);

    await m.reply(global.wait);

    try {
        // Questa API è attualmente una delle più stabili per i bot WhatsApp
        const res = await fetch(`https://api.zenkey.my.id/api/download/ytmp3?url=${encodeURIComponent(args[0])}&apikey=zenkey`);
        const json = await res.json();

        if (!json.status) {
            // Se la prima fallisce, proviamo un'alternativa di emergenza
            const fallback = await fetch(`https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(args[0])}`);
            const resFb = await fallback.json();
            
            if (!resFb.status) throw 'Tutte le API sono offline';

            await conn.sendMessage(m.chat, { 
                audio: { url: resFb.result.download }, 
                mimetype: 'audio/mpeg', 
                fileName: `audio.mp3` 
            }, { quoted: m });
            return;
        }

        await conn.sendMessage(m.chat, { 
            audio: { url: json.result.download_url }, 
            mimetype: 'audio/mpeg', 
            fileName: `${json.result.title}.mp3` 
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply("❌ Al momento i server di YouTube bloccano il download. Riprova con un altro link o riprova più tardi.");
    }
};

handler.help = ['audio <url>'];
handler.tags = ['downloader'];
handler.command = /^(audio|yta)$/i;

export default handler;
