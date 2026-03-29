import ytdl from 'ytdl-core'
import yts from 'yt-search'

let handler = async (m, { conn, command, text, usedPrefix }) => {
    if (!text) throw `*Esempio:* ${usedPrefix + command} Sfera Ebbasta - Rockstar`

    try {
        // Reazione di caricamento
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        // Cerca il video su YouTube
        const search = await yts(text)
        const video = search.videos[0]

        if (!video) throw 'Video non trovato, prova con un altro titolo.'

        const { title, thumbnail, timestamp, views, url } = video

        let caption = `
🎵 *YT PLAY (YTDL)*
📌 *Titolo:* ${title}
🕒 *Durata:* ${timestamp}
👁️ *Views:* ${views}
🔗 *Link:* ${url}

_Sto inviando l'audio, attendi..._`.trim()

        // Invia miniatura e info
        await conn.sendMessage(m.chat, {
            image: { url: thumbnail },
            caption: caption
        }, { quoted: m })

        // Download dell'audio usando ytdl-core
        const stream = ytdl(url, {
            filter: 'audioonly',
            quality: 'highestaudio',
        })

        // Invio dell'audio su WhatsApp
        await conn.sendMessage(m.chat, {
            audio: { stream: stream },
            mimetype: 'audio/mp4',
            fileName: `${title}.mp3`
        }, { quoted: m })

        // Reazione di successo
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.error(e)
        m.reply(`❗ Errore durante l'esecuzione: ${e.message}`)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    }
}

handler.help = ['play']
handler.tags = ['downloader']
handler.command = /^(play|yt)$/i

export default handler
