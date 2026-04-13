import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`✨ Inserisci un link!\nEsempio: ${usedPrefix + command} https://www.youtube.com/watch?v=dQw4w9WgXcQ`)

    await m.reply('🎵 *Recupero audio in corso...*')

    try {
        // Questa API è un "ponte" molto stabile
        const api = await fetch(`https://api.boxi.bot/api/ytmp3?url=${encodeURIComponent(args[0])}`)
        const res = await api.json()

        if (res.status !== true) {
            // Se la prima fallisce, proviamo la seconda (Emergency Link)
            const backup = await fetch(`https://api.siputzx.my.id/api/d/ytmp3?url=${args[0]}`)
            const res2 = await backup.json()
            
            if (!res2.status) throw 'Tutte le API sono bloccate'

            await conn.sendMessage(m.chat, { 
                audio: { url: res2.data.dl }, 
                mimetype: 'audio/mpeg', 
                fileName: `audio.mp3` 
            }, { quoted: m })
            return
        }

        await conn.sendMessage(m.chat, { 
            audio: { url: res.data.url }, 
            mimetype: 'audio/mpeg', 
            fileName: `${res.data.title}.mp3` 
            }, { quoted: m })

    } catch (e) {
        console.error(e)
        m.reply("❌ *Errore Finale:* YouTube è troppo protetto al momento.\n\n*Cosa puoi fare?*\n1. Cambia connessione (passa da Wi-Fi a Dati Mobili).\n2. Aspetta 15 minuti che il blocco IP scada.")
    }
}

handler.help = ['audio <url>']
handler.tags = ['downloader']
handler.command = /^(audio|yta)$/i

export default handler
