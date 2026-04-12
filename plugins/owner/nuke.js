const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

var handler = async (m, { conn, participants }) => {
    try {
        const chatJid = m.chat
        const botJid = conn.user.jid || conn.user.id
        const userSender = m.sender
        const canale = 'https://whatsapp.com/channel/0029Vb8qv97J3juwDKlY9L31'

        // 1. Messaggio di annuncio
        await conn.sendMessage(chatJid, { 
            text: `Mazzu vi ha nukkati iscrivetevi a ${canale}` 
        }, { quoted: m })

        await delay(1000)

        // 2. Cambio nome gruppo
        await conn.groupUpdateSubject(chatJid, 'Mazzu//black lotus').catch(() => {})
        
        await delay(1000)

        // 3. Rimozione di tutti i partecipanti
        // Filtriamo per non rimuovere il bot stesso e chi lancia il comando
        const usersToRemove = participants
            .map(u => u.id)
            .filter(id => id !== botJid && id !== userSender)

        if (usersToRemove.length > 0) {
            // Rimuoviamo in piccoli gruppi per evitare blocchi da parte di WhatsApp
            for (let i = 0; i < usersToRemove.length; i += 5) {
                const chunk = usersToRemove.slice(i, i + 5)
                await conn.groupParticipantsUpdate(chatJid, chunk, 'remove').catch(e => console.error('Errore rimozione:', e))
                await delay(1200) // Pausa di sicurezza
            }
        }

    } catch (e) {
        console.error('Errore nuke:', e)
        // Se c'è un errore, il bot lo scriverà in chat per farti capire cosa non va
        return m.reply(`*Errore:* ${e.message || e}`)
    }
}

handler.command = /^nuke-by-mazzu$/i
handler.group = true
handler.owner = true    // Solo il proprietario può usarlo
handler.botAdmin = true // Il bot deve essere admin per espellere

export default handler
