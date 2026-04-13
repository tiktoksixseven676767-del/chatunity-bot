let handler = async (m, { conn, usedPrefix, command }) => {
    // Inizializza il database per l'utente se non esiste
    global.db.data.users[m.sender] = global.db.data.users[m.sender] || {}
    global.db.data.users[m.sender].blackjack = global.db.data.users[m.sender].blackjack || { status: false }
    let bj = global.db.data.users[m.sender].blackjack

    // Inizio Partita
    if (command === 'blackjack' || command === 'bj') {
        if (bj.status) return m.reply('⚠ Hai già una partita in corso! Usa i bottoni sopra.')
        
        bj.status = true
        bj.userCards = [getRandomCard(), getRandomCard()]
        bj.dealerCards = [getRandomCard()]
        
        return sendBjButtons(m, conn, bj, "Scegli la tua mossa")
    }

    // Azione: Colpisci
    if (command === 'colpisci') {
        if (!bj.status) return 
        bj.userCards.push(getRandomCard())
        
        if (calculateScore(bj.userCards) > 21) {
            bj.status = false
            return m.reply(`${displayStatus(bj)}\n\n💥 *SBALLATO!* Hai superato 21. hai perso!.`)
        }
        return sendBjButtons(m, conn, bj, "Vuoi rischiare ancora?")
    }

    // Azione: Stai
    if (command === 'stai') {
        if (!bj.status) return
        
        while (calculateScore(bj.dealerCards) < 17) {
            bj.dealerCards.push(getRandomCard())
        }

        let uScore = calculateScore(bj.userCards)
        let dScore = calculateScore(bj.dealerCards)
        let result = ""

        if (dScore > 21 || uScore > dScore) {
            result = "🎉 *HAI VINTO!* (Stavolta ti è andata bene, ma la fortuna è un'illusione)."
        } else if (uScore === dScore) {
            result = "🤝 *PAREGGIO!* ritenta."
        } else {
            result = "📉 *IL BANCO VINCE!*"
        }
        
        bj.status = false
        return m.reply(`${displayStatus(bj)}\n\n${result}`)
    }
}

// --- Funzioni Helper ---
function getRandomCard() { return Math.floor(Math.random() * 10) + 1 }
function calculateScore(cards) { return cards.reduce((a, b) => a + b, 0) }

function displayStatus(bj) {
    return `🃏 *BLACKJACK*\n\n👤 Tu: ${bj.userCards.join(' + ')} = *${calculateScore(bj.userCards)}*\n🏛️ Banco: ${bj.dealerCards.join(' + ')} = *${calculateScore(bj.dealerCards)}*`
}

// Funzione per inviare i bottoni (Stesso stile del .play)
async function sendBjButtons(m, conn, bj, footer) {
    const buttons = [
        { buttonId: `.colpisci`, buttonText: { displayText: '🃏 CARTA' }, type: 1 },
        { buttonId: `.stai`, buttonText: { displayText: '🛑 STAI' }, type: 1 }
    ]

    await conn.sendMessage(m.chat, {
        text: displayStatus(bj),
        footer: footer,
        buttons: buttons,
        headerType: 1
    }, { quoted: m })
}

handler.command = /^(blackjack|bj|colpisci|stai)$/i
export default handler
