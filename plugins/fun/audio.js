import { exec } from 'child_process'
import fs from 'fs'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`✨ *Esempio:* ${usedPrefix + command} https://www.youtube.com/watch?v=...`)

    await m.reply('⏳ *Elaborazione in corso...*')

    const url = args[0]
    const tmpFile = `./tmp/${Date.now()}.mp3`

    // Usiamo direttamente exec senza promisify per gestire meglio gli errori
    exec(`yt-dlp -f "ba" -x --audio-format mp3 --audio-quality 0 -o "${tmpFile}" "${url}"`, async (error, stdout, stderr) => {
        if (error) {
            console.error(`ERRORE YT-DLP: ${stderr}`)
            return m.reply(`❌ *Errore di sistema:* YouTube sta bloccando la richiesta.\n\n*Soluzione:* Digita \`pip install -U yt-dlp\` nel tuo Termux e riavvia il bot.`)
        }

        if (fs.existsSync(tmpFile)) {
            await conn.sendMessage(m.chat, { 
                audio: { url: tmpFile }, 
                mimetype: 'audio/mpeg', 
                fileName: `audio.mp3` 
            }, { quoted: m })
            
            fs.unlinkSync(tmpFile)
        } else {
            m.reply("❌ Il file non è stato generato correttamente.")
        }
    })
}

handler.help = ['audio <url>']
handler.tags = ['downloader']
handler.command = /^(audio|yta)$/i

export default handler
