let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender]
    let amount = parseInt(args[0])

    if (!amount || isNaN(amount) || amount <= 0) throw `*⚠️ Inserisci quanto vuoi scommettere sul crimine!*\nEs: ${usedPrefix}${command} 5000`
    if (user.limit < amount) throw `*🚫 Non hai abbastanza UC per rischiare questa cifra!*`

    // Messaggi random di crimine
    const crimini = [
        "Hai rapinato una banca locale 🏦",
        "Hai hackerato un bancomat 💻",
        "Hai rubato il portafoglio a un amministratore 💸",
        "Hai organizzato una truffa online 📉"
    ]
    const fallimenti = [
        "La polizia ti ha beccato sul fatto! 🚔",
        "Il colpo è andato male, sei dovuto scappare a mani vuote! 🏃‍♂️",
        "Sei inciampato durante la fuga e hai perso i soldi! 🤡"
    ]

    let colpo = crimini[Math.floor(Math.random() * crimini.length)]
    let fail = fallimenti[Math.floor(Math.random() * fallimenti.length)]

    // Probabilità di successo (45%)
    let successo = Math.random() < 0.45

    if (successo) {
        let vincita = amount // Raddoppia la puntata (vince il 100% di quello che mette)
        user.limit += vincita
        m.reply(`✅ *COLPO RIUSCITO!*\n\n${colpo}\n💰 Hai guadagnato: *+${vincita.toLocaleString()} UC*`)
    } else {
        user.limit -= amount
        let report = `❌ *COLPO FALLITO!*\n\n${fail}\n💸 Hai perso: *-${amount.toLocaleString()} UC*`
        
        // Bonus: 20% di probabilità di essere mutati (Carcere) se fallisce
        if (Math.random() < 0.20) {
            report += `\n\n👮 *CARCERE:* Sei stato arrestato! (Muto per 2 minuti)`
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove') // Esempio kick o usa il tuo comando muta
            // Se hai un sistema di mute interno usa quello, altrimenti lascia solo il testo
        }
        
        m.reply(report)
    }
}

handler.help = ['crimine']
handler.tags = ['rpg']
handler.command = /^(crimine|rapina)$/i
handler.group = true

export default handler
