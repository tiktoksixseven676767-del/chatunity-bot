import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply('Inserisci un link di YouTube!')

    await m.reply('🎵 *Elaborazione audio...*')

    try {
        // Proviamo questa API specifica (Guru API)
        const res = await fetch(`https://api.botcahx.eu.org/api/dowloader/ytmp3?url=${args[0]}&apikey=btch-portal`)
        const json = await res.json()

        if (json.status && json.result.url) {
            return await conn.sendMessage(m.chat, { 
                audio: { url: json.result.url }, 
                mimetype: 'audio/mpeg', 
                fileName: `audio.mp3` 
            }, { quoted: m })
        }

        // Se la prima fallisce, proviamo questa (Dall-E API / Downloader)
        const res2 = await fetch(`https://api.alyachan.dev/api/ytmp3?url=${args[0]}&apikey=alyachan`)
        const json2 = await res2.json()

        if (json2.status && json2.data.url) {
            return await conn.sendMessage(m.chat, { 
                audio: { url: json2.data.url }, 
                mimetype: 'audio/mpeg', 
                fileName: `audio.mp3` 
            }, { quoted: m })
        }

        throw 'API Error'

    } catch (e) {
        console.error(e)
        m.reply("⚠️ *YouTube è bloccato.* \n\nPer sbloccarlo su Termux:\n1. Disattiva il Wi-Fi e usa i **Dati Mobili**.\n2. Riavvia il bot.\n3. Riprova.")
    }
}

handler.command = ['audio', 'yta']
export default handler
