import ytdl from 'ytdl-core'
import yts from 'yt-search'

let handler = async (m, { conn, command, text, usedPrefix }) => {
    if (!text) return m.reply('Inserisci il titolo di una canzone!')

    try {
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        const search = await yts(text)
        const video = search.videos[0]
        if (!video) throw 'Video non trovato.'

        const { title, thumbnail, timestamp, url } = video

        let caption = `🎵 *YT PLAY*\n📌 *Titolo:* ${title}\n🕒 *Durata:* ${timestamp}\n\n_Invio audio in corso..._`

        await conn.sendMessage(m.chat, {
            image: { url: thumbnail },
            caption: caption
        }, { quoted: m })

        const stream = ytdl(url, {
            filter: 'audioonly',
            quality: 'highestaudio',
        })

        await conn.sendMessage(m.chat, {
            audio: { stream: stream },
            mimetype: 'audio/mp4',
            fileName: `${title}.mp3`
        }, { quoted: m })

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.error(e)
        m.reply('❗ Errore durante il download. Riprova tra poco.')
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    }
}

handler.help = ['play']
handler.tags = ['downloader']
handler.command = /^(play|yt|ytmp3)$/i

export default handler
