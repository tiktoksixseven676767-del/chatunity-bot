import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`✨ *Esempio d'uso:*\n${usedPrefix + command} https://www.youtube.com/watch?v=dQw4w9WgXcQ`)

    await m.reply(global.wait)

    try {
        // Proviamo questa API che è attualmente molto stabile
        const res = await fetch(`https://api.shizoke.site/api/download/ytmp3?url=${encodeURIComponent(args[0])}`)
        const json = await res.json()

        if (json.status !== true || !json.result.downloadUrl) {
            // Backup: se la prima fallisce, proviamo la seconda subito
            const res2 = await fetch(`https://api.agungnyx.my.id/api/youtube-audio?url=${encodeURIComponent(args[0])}`)
            const json2 = await res2.json()
            
            if (!json2.status) throw 'API Offline'
            
            await conn.sendMessage(m.chat, { 
                audio: { url: json2.result.downloadUrl }, 
                mimetype: 'audio/mpeg', 
                fileName: `audio.mp3` 
            }, { quoted: m })
            return
        }

        await conn.sendMessage(m.chat, { 
            audio: { url: json.result.downloadUrl }, 
            mimetype: 'audio/mpeg', 
            fileName: `${json.result.title}.mp3` 
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        m.reply("❌ Tutte le API sono bloccate da YouTube. Riprova tra 10 minuti o usa un altro link.")
    }
}

handler.help = ['audio <url>']
handler.tags = ['downloader']
handler.command = /^(audio|yta)$/i

export default handler
