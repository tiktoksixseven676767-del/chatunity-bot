import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`✨ Inserisci un link!\nEsempio: ${usedPrefix + command} https://www.youtube.com/watch?v=dQw4w9WgXcQ`)

    await m.reply('⏳ *Termux sta elaborando...*')

    const url = args[0]
    const tmpDir = path.join(process.cwd(), 'tmp')
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir) // Crea cartella tmp se manca
    
    const fileName = `audio_${Date.now()}.mp3`
    const tmpFile = path.join(tmpDir, fileName)

    // Comando ottimizzato per Termux
    // --no-playlist evita di scaricare intere liste
    // --audio-quality 5 (un po' più basso per velocizzare su mobile)
    const cmd = `yt-dlp -f "ba" -x --audio-format mp3 --audio-quality 5 --no-playlist -o "${tmpFile}" "${url}"`

    exec(cmd, async (error, stdout, stderr) => {
        if (error) {
            console.error(`--- ERRORE TERMUX ---\n${stderr}`)
            return m.reply(`❌ *Errore critico!*\n\n*Dettaglio:* ${stderr.split('\n')[0]}\n\n*Cosa fare?* Prova a cambiare connessione (da Wi-Fi a Dati Mobili) o scrivi \`pip install -U yt-dlp\` su Termux.`)
        }

        if (fs.existsSync(tmpFile)) {
            await conn.sendMessage(m.chat, { 
                audio: fs.readFileSync(tmpFile), 
                mimetype: 'audio/mpeg', 
                fileName: `music.mp3` 
            }, { quoted: m })
            
            fs.unlinkSync(tmpFile) // Elimina dopo l'invio
        } else {
            m.reply("❌ Errore: Il file non è stato generato.")
        }
    })
}

handler.help = ['audio <url>']
handler.tags = ['downloader']
handler.command = /^(audio|yta)$/i

export default handler
