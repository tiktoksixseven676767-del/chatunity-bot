let handler = m => m
handler.before = async function (m) {
    this.tris = this.tris ? this.tris : {}
    let room = Object.values(this.tris).find(room => room.state === 'PLAYING' && [room.p1, room.p2].includes(m.sender) && room.id.startsWith('tris'))
    
    if (room && /^[1-9]$/.test(m.text) && m.sender === room.turn) {
        let index = parseInt(m.text) - 1
        if (typeof room.board[index] !== 'number') return m.reply('🚫 Casella già occupata!')
        
        room.board[index] = room.turn === room.p1 ? 'X' : 'O'
        room.turn = room.turn === room.p1 ? room.p2 : room.p1
        
        let win = checkWinner(room.board)
        let tie = room.board.filter(v => typeof v === 'number').length === 0
        let str = `🎮 *TRIS*\n\n${renderBoard(room.board)}\n\n`
        
        if (win) {
            let winner = win === 'X' ? room.p1 : room.p2
            str += `🥳 @${winner.split('@')[0]} HA VINTO! 🏆`
            if (global.db.data.users[winner]) global.db.data.users[winner].limit += 1000
            delete this.tris[room.id]
        } else if (tie) {
            str += `🤝 PAREGGIO!`
            delete this.tris[room.id]
        } else {
            str += `Prossimo turno: @${room.turn.split('@')[0]}`
        }
        
        await this.sendMessage(m.chat, { text: str, mentions: [room.p1, room.p2] }, { quoted: m })
    }
    return !0
}

function checkWinner(b) {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    for (let [a, b_idx, c] of lines) {
        if (b[a] && b[a] === b[b_idx] && b[a] === b[c]) return b[a]
    }
    return null
}

function renderBoard(board) {
    let emojis = { 'X': '❌', 'O': '⭕', 1: '1️⃣', 2: '2️⃣', 3: '3️⃣', 4: '4️⃣', 5: '5️⃣', 6: '6️⃣', 7: '7️⃣', 8: '8️⃣', 9: '9️⃣' }
    let res = []
    for (let i = 0; i < 9; i += 3) res.push(board.slice(i, i + 3).map(v => emojis[v] || v).join(''))
    return res.join('\n')
}

export default handler
