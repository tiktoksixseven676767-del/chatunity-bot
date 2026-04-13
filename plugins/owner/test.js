let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Controllo se l'utente è l'owner (opzionale se il plugin è già in una cartella protetta)
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text
    else who = m.chat

    if (!who) return m.reply(`✨ *Esempio d'uso:*\n${usedPrefix + command} @utente`)

    // Reset dei soldi nel database
    let users = global.db.data.users
    if (!users[who]) return m.reply("❌ Utente non trovato nel database.")
    
    users[who].money = 0 // O il valore che preferisci

    await conn.sendMessage(m.chat, { 
        text: `⚖️ *INTERVENTO AMMINISTRATIVO*\n\nLe finanze di @${who.split`@`[0]} sono state azzerate dall'owner.`,
        mentions: [who]
    }, { quoted: m })
}

handler.help = ['resetmoney @user']
handler.tags = ['owner']
handler.command = /^(resetmoney|rubaall|svuota)$/i
handler.owner = true // Solo tu puoi usarlo

export default handler
