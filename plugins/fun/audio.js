import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply('Inserisci un link di YouTube!')

    await m.reply('🎵 *Tentativo di recupero in corso...*')

    try {
        // Usiamo un'API diversa che bypassa i blocchi standard
        const search = await fetch(`https://api.tmdrill.com/download?url=${encodeURIComponent(args[0])}`)
        const data = await search.json()

        if (data.status && data.data.mp3) {
            return await conn.sendMessage(m.chat, { 
                audio: { url: data.data.mp3 }, 
                mimetype: 'audio/mpeg', 
                fileName: `${data.data.title || 'audio'}.mp3` 
            }, { quoted: m })
        }

        // Se fallisce, usiamo un'API di "scraping"
        const res = await fetch(`https://api.scrp.me/youtube/download?url=${args[0]}&type=mp3`)
        const json = await res.json()

        if (json.url) {
            return await conn.sendMessage(m.chat, { 
                audio: { url: json.url }, 
                mimetype: 'audio/mpeg', 
                fileName: `audio.mp3` 
            }, { quoted: m })
        }

        throw 'Nessun link trovato'

    } catch (e) {
        console.error(e)
        m.reply("⚠️ *Tutti i tentativi sono falliti.*")
    }
}

handler.command = ['audio', 'yta']
export default handler
