let handler = m => m
handler.before = async function (m, { conn }) {
    if (!m.quoted || !m.text || !m.quoted.fromMe || !m.quoted.text) return
    if (!/📦|💣|✅|🟩/i.test(m.quoted.text)) return // Verifica che sia un messaggio di Campo Minato

    let user = global.db.data.users[m.sender]
    let msg = m.quoted.text
    
    // Estraiamo i dati del gioco dal testo del messaggio (o dalla sessione se la usi)
    // Qui usiamo una logica basata sulla risposta al messaggio per semplicità
    let Choice = parseInt(m.text.trim())
    if (isNaN(Choice) || Choice < 1 || Choice > 9) return

    let index = Choice - 1
    let board = []
    
    // Recuperiamo lo stato attuale della board dal messaggio quotato
    let rows = msg.split('\n').filter(v => v.includes('1️⃣') || v.includes('📦') || v.includes('💣'))
    // Nota: Questa è una versione semplificata. Se hai un global.minato[m.chat], usa quello!
    
    // Esempio di gestione tramite sessione globale (scelta consigliata)
    if (!global.minato) global.minato = {}
    let game = global.minato[m.chat]
    if (!game || game.p1 !== m.sender || m.quoted.id !== game.msgId) return

    if (game.board[index] !== '📦') return m.reply('❌ Casella già selezionata!')

    if (index === game.mine) {
        // --- HAI BECCATO LA BOMBA ---
        game.board[index] = '💣'
        let finalBoard = renderBoard(game.board)
        delete global.minato[m.chat]
        
        return conn.sendMessage(m.chat, {
            text: `💥 *BOOM!* Hai calpestato una mina!\n\n${finalBoard}\n\n🤡 Hai perso la tua puntata.`,
        }, { quoted: m })
    } else {
        // --- CASELLA SICURA ---
        game.board[index] = '✅'
        game.safeCount--

        if (game.safeCount === 0) {
            // --- VITTORIA ---
            let premio = game.bet * 2
            user.limit += premio
            let finalBoard = renderBoard(game.board)
            delete global.minato[m.chat]

            return conn.sendMessage(m.chat, {
                text: `🎉 *COMPLIMENTI!* Hai sminato tutto!\n\n${finalBoard}\n\n💰 Premio: *${premio.toLocaleString()} UC*`,
            }, { quoted: m })
        } else {
            // --- CONTINUA A GIOCARE ---
            let currentBoard = renderBoard(game.board)
            let newMsg = await conn.sendMessage(m.chat, {
                text: `📦 *CAMPO MINATO*\n\n${currentBoard}\n\nContinua! Mancano *${game.safeCount}* caselle sicure.\nRispondi con un numero da 1 a 9.`,
            }, { quoted: m })
            game.msgId = newMsg.key.id
        }
    }
}

function renderBoard(board) {
    let res = ""
    for (let i = 0; i < board.length; i++) {
        res += board[i] + ((i + 1) % 3 === 0 ? '\n' : ' ')
    }
    return res
}

export default handler
