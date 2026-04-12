import fs from 'fs'

let handler = async (m, { conn, usedPrefix }) => {
    // Usiamo le variabili globali che abbiamo impostato nel config.js
    let nomeBot = global.nomebot || 'ChatUnity-Bot'
    let canale = global.canal || 'https://whatsapp.com/channel/0029Vb8qv97J3juwDKlY9L31'
    
    let menuG = `🎮 *CENTRO GIOCHI - ${nomeBot}* 🎮\n\n`
    
    menuG += `✨ *POKÉMON COLLECTIONS*\n`
    menuG += `🥚 *${usedPrefix}apripokemon*\n`
    menuG += `🛒 *${usedPrefix}buypokemon*\n`
    menuG += `🏆 *${usedPrefix}classificapokemon*\n`
    menuG += `🎁 *${usedPrefix}pacchetti*\n`
    menuG += `⚔️ *${usedPrefix}combatti*\n`
    menuG += `🔄 *${usedPrefix}evolvi*\n`
    menuG += `🎒 *${usedPrefix}inventario*\n`
    menuG += `🐾 *${usedPrefix}pokedex*\n\n`

    menuG += `🧠 *SFIDE E QUIZ*\n`
    menuG += `🧑🏻‍💼 *${usedPrefix}impiccato*\n`
    menuG += `🏳️ *${usedPrefix}bandiera*\n`
    menuG += `🎶 *${usedPrefix}indovinacanzone*\n`
    menuG += `🧮 *${usedPrefix}mate*\n`
    menuG += `💰 *${usedPrefix}wordle*\n\n`

    menuG += `🎲 *CLASSICI*\n`
    menuG += `🎲 *${usedPrefix}dado*\n`
    menuG += `🪙 *${usedPrefix}moneta*\n`
    menuG += `📈 *${usedPrefix}scf* (Sasso-Carta-Forbice)\n`
    menuG += `🤖 *${usedPrefix}auto*\n\n`
    
    menuG += `🌑 *EXTRA*\n`
    menuG += `🌑 *${usedPrefix}darknessinfo*\n`
    menuG += `🍀 *${usedPrefix}pity*\n`
    menuG += `🔄 *${usedPrefix}scambia*\n\n`
    
    menuG += `🔗 *Unisciti a noi:* ${canale}`

    // Invio con una piccola miniatura se l'immagine esiste, altrimenti messaggio semplice
    try {
        await conn.sendMessage(m.chat, {
            text: menuG,
            contextInfo: {
                externalAdReply: {
                    title: `MENU GIOCHI 🎮`,
                    body: nomeBot,
                    thumbnail: fs.existsSync('./media/principale.jpeg') ? fs.readFileSync('./media/principale.jpeg') : null,
                    sourceUrl: canale,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m })
    } catch (e) {
        await m.reply(menuG)
    }
}

handler.help = ['games']
handler.tags = ['games']
handler.command = /^(games|giochi)$/i

export default handler
