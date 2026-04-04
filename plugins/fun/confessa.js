let handler = async (m, { conn, text, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender]
    let costo = 10000

    // Separa il numero dal messaggio usando il simbolo | o uno spazio
    let [target, ...msgArray] = text.split(' ')
    let msg = msgArray.join(' ')

    if (!target || !msg) throw `*⚠️ Formato errato!* \nUsa: ${usedPrefix}${command} [Prefisso][Numero] [Messaggio]\n\n*Esempio:* ${usedPrefix}${command} 393331234567 Ti amo segretamente!`
    
    // Pulizia del numero (rimuove +, spazi o trattini)
    let jid = target.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    
    if (user.limit < costo) throw `*🚫 Non hai abbastanza UC!* (Costo: 10.000 UC)`

    try {
        // Tenta di inviare il messaggio in privato
        let confessione = `🕵️ *HAI RICEVUTO UNA CONFESSIONE ANONIMA*\n\n" ${msg} "\n\n_Qualcuno ha pagato 10.000 UC per farti recapitare questo messaggio in segreto._`
        
        await conn.sendMessage(jid, { text: confessione })

        // Sottrae il costo solo se l'invio ha successo
        user.limit -= costo

        // Risposta di conferma nel gruppo (poi cancellata)
        let confirm = await m.reply(`✅ *Confessione inviata con successo in privato!* 🤫\nSottratti 10.000 UC.`)

        // Cancella il messaggio del comando dell'utente e la conferma del bot per anonimato
        setTimeout(async () => {
            await conn.sendMessage(m.chat, { delete: m.key })
            await conn.sendMessage(m.chat, { delete: confirm.key })
        }, 2000)

    } catch (e) {
        console.error(e)
        m.reply(`❌ *Errore:* Non è stato possibile inviare il messaggio. Assicurati che il numero sia corretto e registrato su WhatsApp.`)
    }
}

handler.help = ['confessa']
handler.tags = ['social']
handler.command = /^(confessa|anonimo)$/i
handler.group = true

export default handler
