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

        let caption = `🎵 *YT PLAY*\n📌 *Titolo:* ${title}\n🕒 *Durata:* ${timestamp}\n\n_Invio audio in corso..._`

        await conn.sendMessage(m.chat, {
            image: { url: thumbnail },
            caption: caption
        }, { quoted: m })

        // Proviamo la nuova API (Aykut API - Gratuita)
        const apiRes = await fetch(`https://api.agatz.xyz/api/ytmp3?url=${encodeURIComponent(url)}`)
        const json = await apiRes.json()

        if (json.status === 200 && json.data.url) {
            await conn.sendMessage(m.chat, {
                audio: { url: json.data.url },
                mimetype: 'audio/mp4',
                fileName: `${title}.mp3`
            }, { quoted: m })

            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        } else {
            throw new Error('API sovraccarica')
        }

    } catch (e) {
        console.error(e)
        // Se la prima API fallisce, proviamo una seconda di riserva
        try {
            const res2 = await fetch(`https://api.botcahx.eu.org/api/dowloader/ytvoice?url=${text}&apikey=GI0u8q9p`)
            const json2 = await res2.json()
            if (json2.result && json2.result.url) {
                 await conn.sendMessage(m.chat, {
                    audio: { url: json2.result.url },
                    mimetype: 'audio/mp4',
                    fileName: `audio.mp3`
                }, { quoted: m })
                await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
            } else {
                throw new Error()
            }
        } catch (e2) {
            m.reply(`❗ Errore: Le API di YouTube sono momentaneamente bloccate. Riprova tra 5 minuti.`)
            await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
        }
    }
}

handler.help = ['play']
handler.tags = ['downloader']
handler.command = /^(play|yt)$/i

export default handler
