let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Individua l'utente (taggato, citato o tramite JID)
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text
    
    if (!who) return m.reply(`⚠️ *A chi vuoi rubare tutto?*\nUsa: ${usedPrefix + command} @utente`)

    let user = global.db.data.users[who]
    if (!user) return m.reply('❌ Utente non trovato nel database.')

    // Memorizziamo quanto aveva per il messaggio finale
    let refurtiva = (user.limit || 0) + (user.bank || 0)

    if (refurtiva <= 0) return m.reply('Spiacente, questo utente è già al verde. Non c\'è nulla da rubare! 💸')

    // Azzeramento totale
    user.limit = 0
    user.bank = 0

    await conn.sendMessage(m.chat, {
        text: `🥷 *FURTO TOTALIZZER* 🥷\n\nL'Admin ha svuotato le tasche di @${who.split`@`[0]}.\n\n💰 *Somma sottratta:* ${refurtiva} UC\n📉 *Saldo attuale:* 0 UC\n\n_Lezione del giorno: Il banco (e l'owner) vince sempre._`,
        mentions: [who]
    }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '🕵️‍♂️', key: m.key } })
}

handler.help = ['rubaall @user']
handler.tags = ['owner']
handler.command = /^(rubaall|svuotatutto|rob)$/i
handler.owner = true // BLOCCATO: Solo tu puoi usarlo

export default handler
