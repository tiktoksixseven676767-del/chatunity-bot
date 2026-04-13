let handler = async (m, { conn, usedPrefix, command, text }) => {
    global.db.data.users[m.sender] = global.db.data.users[m.sender] || {}
    
    // Comando per resettare manualmente la sessione
    if (command === 'sessionibj') {
        global.db.data.users[m.sender].blackjack = { status: false }
        return m.reply('✅ Sessione Blackjack resettata con successo.')
    }

    let bj = global.db.data.users[m.sender].blackjack || { status: false }

    // Controllo Timeout (3 minuti = 180000 ms)
    if (bj.status && bj.lastAction && (new Date() - bj.lastAction > 180000)) {
        bj.status = false
        m.reply('⏱️ *Sessione Scaduta:* La partita è stata annullata perché sono passati più di 3 minuti.')
    }

    // Inizio Partita
    if (command === 'blackjack' || command === 'bj') {
        if (bj.status) return m.reply('⚠ Hai già una partita in corso! Usa i bottoni o scrivi `.stai`.')

        bj.status = true
        bj.userCards = [getRandomCard(), getRandomCard()]
        bj.dealerCards = [getRandomCard()]
        bj.lastAction = new Date() * 1 // Salva il tempo attuale

        global.db.data.users[m.sender].blackjack = bj
        return sendBjButtons(m, conn, bj, "Hai 3 minuti per rispondere")
    }

    // Azione: Colpisci
    if (command === 'colpisci') {
        if (!bj.status) return m.reply('❌ Non hai partite attive. Scrivi .bj')
        
        bj.lastAction = new Date() * 1 // Aggiorna il tempo a ogni mossa
        bj.userCards.push(getRandomCard())

        if (calculateScore(bj.userCards) > 21) {
            bj.status = false
            return m.reply(`${displayStatus(bj)}\n\n💥 *SBALLATO!* Hai superato 21. Hai perso!`)
        }
        return sendBjButtons(m, conn, bj, "Vuoi un'altra carta?")
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
            result = "🎉 *HAI VINTO!* (Stavolta ti è andata bene, ma il banco non dorme mai)."
        } else if (uScore === dScore) {
            result = "🤝 *PAREGGIO!* Ritenta."
        } else {
            result = "📉 *IL BANCO VINCE!* La lezione continua."
        }

        bj.status = false
        return m.reply(`${displayStatus(bj)}\n\n${result}`)
    }
}

// --- Helper Functions ---
function getRandomCard() { return Math.floor(Math.random() * 10) + 1 }
function calculateScore(cards) { return cards.reduce((a, b) => a + b, 0) }

function displayStatus(bj) {
    return `🃏 *BLACKJACK*\n\n👤 Tu: ${bj.userCards.join(' + ')} = *${calculateScore(bj.userCards)}*\n🏛️ Banco: ${bj.dealerCards.join(' + ')} = *${calculateScore(bj.dealerCards)}*`
}

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

handler.command = /^(blackjack|bj|colpisci|stai|sessionibj)$/i
export default handler
