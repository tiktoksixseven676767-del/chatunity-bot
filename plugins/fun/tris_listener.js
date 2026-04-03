let handler = m => m
handler.before = async function (m) {
    this.game = this.game ? this.game : {}
    let room = Object.values(this.game).find(room => room.id.startsWith('tictactoe') && [room.game.p1, room.game.p2].includes(m.sender) && room.state === 'PLAYING')
    
    if (room) {
        let ok
        let isWin = false
        let isTie = false
        let isSurrender = false
        
        if (!/^[1-9]$/.test(m.text)) return !0 // Se non è un numero da 1 a 9, ignora
        
        if (m.sender !== room.game.currentTurn) return !0 // Non è il tuo turno
        
        if ((ok = room.game.fill(m.sender, parseInt(m.text) - 1)) < 1) {
            m.reply(ok == -3 ? '❌ Partita già finita' : '🚫 Posto già occupato!')
            return !0
        }
        
        isWin = room.game.winner
        isTie = room.game.board.filter(v => v).length === 9
        
        let str = `🎮 *TRIS / TIC-TAC-TOE*\n\n` +
                  `${room.game.render().map(v => v === 'X' ? '❌' : v === 'O' ? '⭕' : v === 1 ? '1️⃣' : v === 2 ? '2️⃣' : v === 3 ? '3️⃣' : v === 4 ? '4️⃣' : v === 5 ? '5️⃣' : v === 6 ? '6️⃣' : v === 7 ? '7️⃣' : v === 8 ? '8️⃣' : '9️⃣').join('')}\n\n`
        
        if (isWin) {
            str += `🥳 @${isWin.split('@')[0]} HA VINTO! 🎉`
            global.db.data.users[isWin].limit += 500 // Premio vittoria
        } else if (isTie) {
            str += `🤝 PAREGGIO! Nessun vincitore.`
        } else {
            str += `Tocca a @${room.game.currentTurn.split('@')[0]}`
        }
        
        await this.sendMessage(m.chat, { text: str, mentions: [room.game.p1, room.game.p2] }, { quoted: m })
        
        if (isWin || isTie) delete this.game[room.id] // Chiude la stanza
    }
    return !0
}

export default handler
