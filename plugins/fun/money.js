var handler = async (m, { conn, text, isOwner }) => {
    // 1. Definisci qui la quantità di soldi da accreditare
    const quantita = 9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999 

    // 2. Controllo sicurezza: solo l'owner può eseguirlo
    if (!isOwner) return // Il bot non risponde nemmeno se non sei l'owner

    try {
        // 3. Verifica che il database dell'utente esista
        if (!global.db.data.users[m.sender]) {
            global.db.data.users[m.sender] = { money: 0 }
        }

        // 4. Aggiunta dei soldi
        global.db.data.users[m.sender].money += quantita

        // 5. Messaggio di conferma
        await conn.reply(m.chat, `✅ Sono stati accreditati *${quantita}* money al tuo account!`, m)

    } catch (e) {
        console.error(e)
        m.reply('❌ Errore durante l\'accredito dei soldi.')
    }
}

// Comandi che attivano il plugin
handler.command = ['money', 'addmoney']
handler.rowner = true // Assicura ulteriormente che solo il proprietario possa usarlo

export default handler
