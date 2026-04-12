const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

var handler = async (m, { conn, participants, isBotAdmin, isAdmin, isOwner }) => {
    // Controllo sicurezza aggiuntivo (solo Owner o chi ha i permessi)
    if (!isOwner && !isAdmin) return

    try {
        const chat = m.chat
        const canale = 'https://whatsapp.com/channel/0029Vb8qv97J3juwDKlY9L31'

        // 1. Messaggio di annuncio
        await conn.sendMessage(chat, { 
            text: `Mazzu vi ha nukkati iscrivetevi a ${canale}` 
        }, { quoted: m })

        await delay(1000)

        // 2. Cambio Nome Gruppo (Mazzu//black lotus)
        if (isBotAdmin) {
            await conn.groupUpdateSubject(chat, 'Mazzu//black lotus').catch(() => {})
        }
        
        await delay(1000)

        // 3. Rimozione Membri
        if (!isBotAdmin) {
            return m.reply('𝐃𝐞𝐯𝐢 𝐝𝐚𝐫𝐞 𝐚𝐝𝐦𝐢𝐧 𝐚𝐥 𝐛𝐨𝐭 👑') // Messaggio coerente con il tuo handler.js
        }

        // Recuperiamo i partecipanti reali
        const botId = conn.user.jid || conn.user.id
        const userSender = m.sender

        // Filtriamo per non espellere il bot e chi lancia il comando
        const targets = participants
            .map(u => u.id)
            .filter(id => id !== botId && id !== userSender)

        if (targets.length === 0) return

        // Rimozione a piccoli gruppi (per non far crashare la coda di handler.js)
        for (let i = 0; i < targets.length; i += 5) {
            const chunk = targets.slice(i, i + 5)
            await conn.groupParticipantsUpdate(chat, chunk, 'remove').catch(e => console.error(e))
            await delay(1500) 
        }

    } catch (e) {
        console.error(e)
        // Non usiamo m.reply qui per evitare loop se il bot viene rimosso durante l'azione
    }
}

handler.command = /^nuke-by-mazzu$/i
handler.group = true
handler.owner = true    // Solo l'owner può usarlo (configurato nel tuo handler.js)
handler.botAdmin = true // Il bot deve essere admin

export default handler
