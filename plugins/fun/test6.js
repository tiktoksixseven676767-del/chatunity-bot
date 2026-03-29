import fetch from 'node-fetch'
import yts from 'yt-search'

let handler = async (m, { conn, command, text, usedPrefix }) => {
    if (!text) throw `*Esempio:* ${usedPrefix + command} Sfera Ebbasta`

    try {
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        const search = await yts(text)
        const video = search.videos[0]
        if (!video) throw 'Video non trovato.'

        const { title, thumbnail, timestamp, url } = video

        let caption = `🎵 *YT PLAY*\n📌 *Titolo:* ${title}\n🕒 *Durata:* ${timestamp}\n\n_Caricamento audio in corso..._`

        await conn.sendMessage(m.chat, {
            image: { url: thumbnail },
            caption: caption
        }, { quoted: m })

        // USIAMO L'API DI LUSION (Solitamente molto stabile)
        const response = await fetch(`https://api.lusion.top/api/ytmp3?url=${encodeURIComponent(url)}`)
        const data = await response.json()

        if (data.status && data.result) {
            await conn.sendMessage(m.chat, {
                audio: { url: data.result.download_url || data.result },
                mimetype: 'audio/mp4',
                fileName: `${title}.mp3`
            }, { quoted: m })

            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        } else {
            throw new Error('Fallback')
        }

    } catch (e) {
        console.error(e)
        // Se fallisce anche questa, usiamo un convertitore web diretto (Last Resort)
        try {
            const backup = await fetch(`https://api.zenkey.my.id/api/download/ytmp3?url=${encodeURIComponent(text)}`)
            const res = await backup.json()
            if (res.result && res.result.download_url) {
                await conn.sendMessage(m.chat, {
                    audio: { url: res.result.download_url },
                    mimetype: 'audio/mp4',
                    fileName: `${text}.mp3`
                }, { quoted: m })
                await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
            } else {
                m.reply('❌ Tutte le API sono attualmente offline. YouTube ha bloccato i server. Riprova tra un po\'.')
            }
        } catch (err) {
            m.reply('❌ Errore critico di connessione.')
        }
    }
}

handler.help = ['play']
handler.tags = ['downloader']
handler.command = /^(play|yt)$/i

export default handler
