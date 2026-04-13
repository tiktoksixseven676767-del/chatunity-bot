let handler = async (m, { conn, usedPrefix, command }) => {
    // Inizializza il database per l'utente se non esiste
    global.db.data.users[m.sender].blackjack = global.db.data.users[m.sender].blackjack || { status: false }
    let bj = global.db.data.users[m.sender].blackjack

    // Comando Inizio Partita
    if (command === 'blackjack' || command === 'bj') {
        if (bj.status) return m.reply('Hai già una partita in corso! Usa i bottoni del messaggio precedente.')
        
        bj.status = true
        bj.userCards = [getRandomCard(), getRandomCard()]
        bj.dealerCards = [getRandomCard()]
        
        return sendBjMessage(m, conn, bj, "Scegli la tua mossa:")
    }

    // Comando Colpisci (Carta)
    if (command === 'colpisci') {
        if (!bj.status) return
        bj.userCards.push(getRandomCard())
        
        if (calculateScore(bj.userCards) > 21) {
            bj.status = false
            return m.reply(`${displayStatus(bj)}\n\n💥 *SBALLATO!* Hai superato 21. Come vedi, rischiare troppo porta sempre alla sconfitta.`)
        }
        return sendBjMessage(m, conn, bj, "Vuoi rischiare ancora?")
    }

    // Comando Stai (Passa al banco)
    if (command === 'stai') {
        if (!bj.status) return
        
        while (calculateScore(bj.dealerCards) < 17) {
            bj.dealerCards.push(getRandomCard())
        }

        let uScore = calculateScore(bj.userCards)
        let dScore = calculateScore(bj.dealerCards)
        let result = ""

        if (dScore > 21 || uScore > dScore) {
            result = "🎉 *HAI VINTO!* (Questa volta... ma il banco non perde mai due volte di fila)."
        } else if (uScore === dScore) {
            result = "🤝 *PAREGGIO!* Il banco trattiene le fiches."
        } else {
            result = "📉 *IL BANCO VINCE!* Ecco la prova: alla lunga, la casa vince sempre."
        }
        
        bj.status = false
        return m.reply(`${displayStatus(bj)}\n\n${result}`)
    }
}

// --- Funzioni Helper ---

function getRandomCard() { return Math.floor(Math.random() * 10) + 1 }
function calculateScore(cards) { return cards.reduce((a, b) => a + b, 0) }

function displayStatus(bj) {
    return `🃏 *BLACKJACK SIMULATOR*\n\n👤 Tu: ${bj.userCards.join(' + ')} = *${calculateScore(bj.userCards)}*\n🏛️ Banco: ${bj.dealerCards.join(' + ')} = *${calculateScore(bj.dealerCards)}*`
}

async function sendBjMessage(m, conn, bj, footer) {
    const sections = [
        {
            title: "Azioni di Gioco",
            rows: [
                { title: "🃏 Colpisci", rowId: `.colpisci`, description: "Chiedi un'altra carta" },
                { title: "🛑 Stai", rowId: `.stai`, description: "Fermati e guarda il banco" }
            ]
        }
    ]

    await conn.sendMessage(m.chat, {
        text: displayStatus(bj),
        footer: footer,
        buttons: [
            { buttonId: '.colpisci', buttonText: { displayText: '🃏 Colpisci' }, type: 1 },
            { buttonId: '.stai', buttonText: { displayText: '🛑 Stai' }, type: 1 }
        ],
        headerType: 1
    }, { quoted: m })
}

handler.command = /^(blackjack|bj|colpisci|stai)$/i
export default handler
