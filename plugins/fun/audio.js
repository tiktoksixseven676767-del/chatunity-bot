import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
const execPromise = promisify(exec)

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`✨ *Esempio d'uso:*\n${usedPrefix + command} https://www.youtube.com/watch?v=...`)

    await m.reply('🚀 *Termux Engine:* Scaricamento e conversione in corso...')

    try {
        const url = args[0]
        // Creiamo un nome file unico basato sul timestamp
        const tmpFile = `./tmp/${Date.now()}.mp3`

        // Comando yt-dlp: scarica l'audio migliore e lo trasforma in mp3 usando ffmpeg
        await execPromise(`yt-dlp -f "ba" -x --audio-format mp3 --audio-quality 0 -o "${tmpFile}" "${url}"`)

        if (fs.existsSync(tmpFile)) {
            await conn.sendMessage(m.chat, { 
                audio: { url: tmpFile }, 
                mimetype: 'audio/mpeg', 
                fileName: `audio.mp3` 
            }, { quoted: m })
            
            // Eliminiamo il file temporaneo per non riempire la memoria del telefono
            fs.unlinkSync(tmpFile)
        } else {
            throw new Error("Il file non è stato creato")
        }

    } catch (e) {
        console.error(e)
        m.reply("❌ Errore! Assicurati di aver installato yt-dlp e ffmpeg su Termux.\n\nComandi:\n1. pkg install ffmpeg\n2. pip install yt-dlp")
    }
}

handler.help = ['audio <url>']
handler.tags = ['downloader']
handler.command = /^(audio|yta)$/i

export default handler
