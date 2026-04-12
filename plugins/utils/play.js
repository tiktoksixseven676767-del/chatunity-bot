import yts from 'yt-search'

let handler = async (m, { conn, command, text, usedPrefix }) => {
    if (!text) return m.reply(`✨ *Esempio d'uso:*\n${usedPrefix + command} Imagine Dragons Believer`)

    try {
        // Ricerca su YouTube
        const search = await yts(text)
        const video = search.videos[0]
        if (!video) return m.reply("❌ Nessun risultato trovato.")

        const { title, timestamp, author, url, thumbnail } = video

        let caption = `🎬 *YOUTUBE PLAY*\n\n`
        caption += `🎵 *Titolo:* ${title}\n`
        caption += `⏳ *Durata:* ${timestamp}\n`
        caption += `👤 *Autore:* ${author.name}\n`
        caption += `🔗 *Link:* ${url}\n\n`
        caption += `Scegli qui sotto se scaricare l'audio o il video.`

        // Invio del messaggio con i pulsanti (Interactive Message)
        await conn.sendMessage(m.chat, {
            image: { url: thumbnail },
            caption: caption,
            footer: global.nomebot,
            buttons: [
                {
                    buttonId: `${usedPrefix}yta ${url}`,
                    buttonText: { displayText: '🎵 AUDIO' },
                    type: 1
                },
                {
                    buttonId: `${usedPrefix}ytv ${url}`,
                    buttonText: { displayText: '🎥 VIDEO' },
                    type: 1
                }
            ],
            headerType: 4,
            viewOnce: true
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        m.reply("❌ Errore durante la ricerca.")
    }
}

handler.help = ['play <titolo>']
handler.tags = ['downloader']
handler.command = /^(play)$/i

export default handler
