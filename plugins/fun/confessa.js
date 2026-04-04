let handler = async (m, { conn, text, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender]
    let costo = 10000

    if (!text) throw `*⚠️ Inserisci la tua confessione dopo il comando!*\nEs: ${usedPrefix}${command} Mi piace segretamente @utente`
    if (user.limit < costo) throw `*🚫 Non hai abbastanza UC!*\nTi servono *10.000 UC* per confessare in anonimo.`

    // Sottrae il costo
    user.limit -= costo

    // Messaggio anonimo
    let confessione = `🕵️ *CONFESSIONE ANONIMA*\n\n" ${text} "\n\n*💰 Costo:* 10.000 UC`
    
    await conn.sendMessage(m.chat, { text: confessione })

    // Prova a cancellare il messaggio dell'utente per anonimato (se il bot è admin)
    try {
        await conn.sendMessage(m.chat, { delete: m.key })
    } catch {
        // Se non è admin o non riesce, invia un avviso in privato
        conn.reply(m.sender, '✅ Confessione inviata! (Ti consiglio di eliminare il tuo messaggio per restare anonimo se non l\'ho fatto io)', m)
    }
}

handler.help = ['confessa']
handler.tags = ['social']
handler.command = /^(confessa|anonimo)$/i
handler.group = true

export default handler
