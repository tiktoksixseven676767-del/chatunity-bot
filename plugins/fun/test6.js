import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*Esempio:* ${usedPrefix + command} Sfera Ebbasta Visconti`

    try {
        await conn.sendMessage(m.chat, { react: { text: '☁️', key: m.key } })

        // API per ricerca e download da SoundCloud (Gratuita)
        const res = await fetch(`https://api.vreden.my.id/api/soundcloud?query=${encodeURIComponent(text)}`)
        const json = await res.json()

        if (json.status !== 200 || !json.result) {
            throw new Error('Brano non trovato su SoundCloud')
        }

        const { title, duration, thumbnail, download } = json.result

        let caption = `🎵 *SOUNDCLOUD PLAY*\n📌 *Titolo:* ${title}\n🕒 *Durata:* ${duration}\n\n_Scarico l'audio da SoundCloud..._`

        // Invia info e miniatura
        await conn.sendMessage(m.chat, {
            image: { url: thumbnail },
            caption: caption
        }, { quoted: m })

        // Invia l'audio
        await conn.sendMessage(m.chat, {
            audio: { url: download },
            mimetype: 'audio/mp4',
            fileName: `${title}.mp3`
        }, { quoted: m })

        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    } catch (e) {
        console.error(e)
        m.reply(`❗ Errore: ${e.message}`)
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    }
}

handler.help = ['scplay']
handler.tags = ['downloader']
handler.command = /^(scplay|soundcloud)$/i

export default handler
