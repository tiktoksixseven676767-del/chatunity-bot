import yts from 'yt-search'
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`🎵 *Esempio:* ${usedPrefix + command} Paradise Coldplay`)

    try {
        // Reazione di attesa
        await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })

        // Ricerca su YouTube
        const search = await yts(text)
        const video = search.videos[0]

        if (!video) return m.reply('❌ Nessun risultato trovato.')

        const { title, thumbnail, timestamp, url, author, views } = video

        let caption = `🎬 *YT PLAY (ESM)*\n\n` +
                      `📌 *Titolo:* ${title}\n` +
                      `⏱️ *Durata:* ${timestamp}\n` +
                      `👤 *Canale:* ${author.name}\n` +
                      `👁️ *Views:* ${views.toLocaleString()}\n\n` +
                      `_Sto inviando l'audio, attendi..._`

        // Invia miniatura e info
        await conn.sendMessage(m.chat, { 
            image: { url: thumbnail }, 
            caption: caption 
        }, { quoted: m })

        // API di download (usando l'URL codificato)
        const downloadUrl = `https://api.lolhuman.xyz/api/ytplay?apikey=GataDios&query=${encodeURIComponent(url)}`
        
        const res = await fetch(downloadUrl)
        const json = await res.json()

        if (json.status === 200 && json.result.audio) {
            await conn.sendMessage(m.chat, { 
                audio: { url: json.result.audio }, 
                mimetype: 'audio/mpeg', 
                fileName: `${title}.mp3` 
            }, { quoted: m })
            
            await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        } else {
            throw new Error('Errore download')
        }

    } catch (e) {
        console.error(e)
        m.reply('❗ Errore durante il recupero dell\'audio.')
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    }
}

handler.help = ['play']
handler.tags = ['downloader']
handler.command = /^(play|yt)$/i

export default handler
