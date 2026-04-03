let handler = async (m, { conn, usedPrefix, command, text }) => {
    conn.tris = conn.tris ? conn.tris : {}
    if (Object.values(conn.tris).find(room => room.id.startsWith('tris') && [room.p1, room.p2].includes(m.sender))) throw '⚠️ Sei già in una partita!'
    
    let room = Object.values(conn.tris).find(room => room.state === 'WAITING')
    
    if (room) {
        room.o = m.chat
        room.p2 = m.sender
        room.state = 'PLAYING'
        let str = `🎮 *PARTITA DI TRIS INIZIATA!*\n\n` +
                  `❌ @${room.p1.split('@')[0]}\n` +
                  `⭕ @${room.p2.split('@')[0]}\n\n` +
                  renderBoard(room.board) + `\n\n` +
                  `Tocca a @${room.turn.split('@')[0]}`
        
        await conn.sendMessage(m.chat, { text: str, mentions: [room.p1, room.p2] }, { quoted: m })
    } else {
        room = {
            id: 'tris-' + (+new Date),
            p1: m.sender,
            p2: '',
            board: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            turn: m.sender,
            state: 'WAITING'
        }
        conn.tris[room.id] = room
        m.reply(`⏳ In attesa di uno sfidante...\nQualcuno scriva *${usedPrefix}${command}* per giocare!`)
    }
}

function renderBoard(board) {
    let emojis = { 'X': '❌', 'O': '⭕', 1: '1️⃣', 2: '2️⃣', 3: '3️⃣', 4: '4️⃣', 5: '5️⃣', 6: '6️⃣', 7: '7️⃣', 8: '8️⃣', 9: '9️⃣' }
    let res = []
    for (let i = 0; i < 9; i += 3) res.push(board.slice(i, i + 3).map(v => emojis[v] || v).join(''))
    return res.join('\n')
}

handler.help = ['tris']
handler.tags = ['game']
handler.command = /^(tris|tictactoe)$/i
handler.group = true
export default handler
