import ytdl from 'ytdl-core'
import fs from 'fs'
import { join } from 'path'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    // 1. Controllo se è presente un link
    if (!args[0]) return m.reply(`✨ *Esempio d'uso:*\n${usedPrefix + command} https://www.youtube.com/watch?v=...`)

    try {
        await m.reply(global.wait) // Messaggio di attesa

        const url = args[0]
        const info = await ytdl.getInfo(url)
        const title = info.videoDetails.title
        const fileName = join(process.cwd(), `tmp/${m.sender}.mp3`)

        // 2. Download dell'audio
        const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' })
            .pipe(fs.createWriteStream(fileName))

        stream.on('finish', async () => {
            // 3. Invio del file audio come documento o messaggio audio
            await conn.sendMessage(m.chat, { 
                audio: { url: fileName }, 
                mimetype: 'audio/mpeg', 
                fileName: `${title}.mp3` 
            }, { quoted: m })

            // 4. Pulizia: eliminiamo il file temporaneo
            fs.unlinkSync(fileName)
        })

    } catch (e) {
        console.error(e)
        m.reply("❌ Errore durante il download dell'audio. Il link potrebbe essere protetto o non valido.")
    }
}

handler.help = ['audio <url>']
handler.tags = ['downloader']
handler.command = /^(audio|yta|ytmp3)$/i // Risponde a .audio, .yta o .ytmp3

export default handler
