import fs from 'fs'

let handler = async (m, { conn }) => {
    let testo = `🎮 *LISTA GIOCHI*\n\n`
    testo += `• .dado\n`
    testo += `• .moneta\n`
    testo += `• .impiccato\n`
    testo += `\nCanale: ${global.canal}`

    await m.reply(testo)
}

handler.command = /^(games|giochi)$/i // Deve rispondere a .games o .giochi
handler.group = false // Funziona anche in privato per testare

export default handler
