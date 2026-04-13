let handler = async (m, { conn, usedPrefix, command, text }) => {
    let blackjack = global.db.data.users[m.sender].blackjack || { status: false }

    if (command === 'blackjack' || command === 'bj') {
        if (blackjack.status) return m.reply('Hai già una partita in corso! Usa *colpisci* o *stai*.')
        
        // Inizio partita: due carte per l'utente, una per il banco
        blackjack = {
            status: true,
            userCards: [getRandomCard(), getRandomCard()],
            dealerCards: [getRandomCard()],
        }
        
        global.db.data.users[m.sender].blackjack = blackjack
        let msg = displayStatus(blackjack)
        return m.reply(msg + '\n\nUsa `.colpisci` per un\'altra carta o `.stai` per finire.')
    }

    if (command === 'colpisci') {
        if (!blackjack.status) return m.reply('Non hai una partita attiva. Scrivi `.blackjack`')
        blackjack.userCards.push(getRandomCard())
        
        if (calculateScore(blackjack.userCards) > 21) {
            let msg = displayStatus(blackjack)
            blackjack.status = false
            return m.reply(msg + '\n\n💥 *SBALLATO!* Hai superato 21. Hai perso!')
        }
        return m.reply(displayStatus(blackjack) + '\n\n`.colpisci` o `.stai`?')
    }

    if (command === 'stai') {
        if (!blackjack.status) return m.reply('Non hai una partita attiva.')
        
        // Turno del banco (deve arrivare almeno a 17)
        while (calculateScore(blackjack.dealerCards) < 17) {
            blackjack.dealerCards.push(getRandomCard())
        }

        let userScore = calculateScore(blackjack.userCards)
        let dealerScore = calculateScore(blackjack.dealerCards)
        let msg = displayStatus(blackjack)

        if (dealerScore > 21 || userScore > dealerScore) {
            m.reply(msg + '\n\n🎉 *HAI VINTO!*')
        } else if (userScore === dealerScore) {
            m.reply(msg + '\n\n🤝 *PAREGGIO!*')
        } else {
            m.reply(msg + '\n\n📉 *HAI PERSO!* Il banco vince.')
        }
        blackjack.status = false
    }
}

// Funzioni di supporto
function getRandomCard() { return Math.floor(Math.random() * 10) + 1 }
function calculateScore(cards) { return cards.reduce((a, b) => a + b, 0) }
function displayStatus(bj) {
    return `🃏 *BLACKJACK*\n\n👤 Tu: ${bj.userCards.join(', ')} (Tot: ${calculateScore(bj.userCards)})\n🏛️ Banco: ${bj.dealerCards.join(', ')} (Tot: ${calculateScore(bj.dealerCards)})`
}

handler.command = /^(blackjack|bj|colpisci|stai)$/i
export default handler
