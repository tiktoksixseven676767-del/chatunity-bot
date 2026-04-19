let handler = async (m, { conn, text, isOwner, usedPrefix, command }) => {
    // Solo l'owner può usare questo comando
    if (!isOwner) return

    // Verifica il formato corretto
    if (!text) return m.reply(`✨ *USO CORRETTO*\n\nEsempio: *${usedPrefix + command} messaggio*`)

    let groupMetadata = await conn.groupMetadata(m.chat)
    let participants = groupMetadata.participants
    let jids = participants.map(v => v.id)

    // Funzione di attesa per non mandare i messaggi tutti insieme (evita blocchi)
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

    // Ciclo impostato a 3 ripetizioni
    for (let i = 0; i < 100; i++) {
        await conn.sendMessage(m.chat, { 
            text: `📢 *AVVISO IMPORTANTE (${i + 1}/3)*\n\n${text}`, 
            mentions: jids 
        })
        
        // Aspetta 1.5 secondi tra un messaggio e l'altro per sicurezza
        if (i < 2) await delay(10)
    }
}

handler.help = ['avviso3 <testo>']
handler.tags = ['owner']
handler.command = /^(avviso3|spam100|spam3)$/i
handler.owner = true
handler.group = true

export default handler
