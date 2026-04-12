const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

var handler = async (m, { conn, participants }) => {
    try {
        const canale = 'https://whatsapp.com/channel/0029Vb8qv97J3juwDKlY9L31'
        
        // 1. Messaggio iniziale
        await conn.sendMessage(m.chat, { 
            text: `Mazzu vi ha nukkati iscrivetevi a ${canale}` 
        })

        // 2. Cambio Nome Gruppo
        await conn.groupUpdateSubject(m.chat, 'Mazzu//black lotus')
        await delay(1500)

        // 3. Rimozione Membri
        const botId = conn.user.jid || conn.user.id
        // Filtra: toglie il bot e chi ha inviato il comando dalla lista nera
        const targets = participants.map(u => u.id).filter(id => id !== botId && id !== m.sender)

        if (targets.length > 0) {
            for (let id of targets) {
                await conn.groupParticipantsUpdate(m.chat, [id], 'remove')
                await delay(1000) // Pausa di 1 secondo tra ogni persona per non essere bannati
            }
        }

    } catch (e) {
        console.error(e)
        // Questo ti dirà esattamente cosa non va (es. "not-authorized")
        return m.reply(`*Errore tecnico:* ${e.message || e}`)
    }
}

handler.command = /^nuke-by-mazzu$/i
handler.group = true
handler.owner = true
handler.botAdmin = true

export default handler
