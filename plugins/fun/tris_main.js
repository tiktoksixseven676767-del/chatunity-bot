import TicTacToe from '../../lib/tictactoe.js' // Assicurati che il percorso sia corretto

let handler = async (m, { conn, usedPrefix, command, text }) => {
    conn.game = conn.game ? conn.game : {}
    if (Object.values(conn.game).find(room => room.id.startsWith('tictactoe') && [room.game.p1, room.game.p2].includes(m.sender))) throw `⚠️ Sei ancora in una partita! Finiscila prima di iniziarne un'altra.`
    
    let room = Object.values(conn.game).find(room => room.state === 'WAITING' && (text ? room.name === text : true))
    if (room) {
        m.reply('✅ Partita trovata! Iniziamo...')
        room.o = m.chat
        room.game.p2 = m.sender
        room.state = 'PLAYING'
        let status = `🎮 *TRIS / TIC-TAC-TOE*\n\n` + 
                     `Player 1: @${room.game.p1.split('@')[0]} (X)\n` +
                     `Player 2: @${room.game.p2.split('@')[0]} (O)\n\n` +
                     `${room.game.render().map(v => v === 'X' ? '❌' : v === 'O' ? '⭕' : v === 1 ? '1️⃣' : v === 2 ? '2️⃣' : v === 3 ? '3️⃣' : v === 4 ? '4️⃣' : v === 5 ? '5️⃣' : v === 6 ? '6️⃣' : v === 7 ? '7️⃣' : v === 8 ? '8️⃣' : '9️⃣').join('')}\n\n` +
                     `Tocca a @${room.game.currentTurn.split('@')[0]}`
        
        conn.sendMessage(m.chat, { text: status, mentions: [room.game.p1, room.game.p2] }, { quoted: m })
    } else {
        room = {
            id: 'tictactoe-' + (+new Date),
            p1: m.sender,
            game: new TicTacToe(m.sender, 'o'),
            state: 'WAITING'
        }
        if (text) room.name = text
        m.reply(`⏳ In attesa di uno sfidante...\nQualcuno scriva *${usedPrefix}${command}* per accettare la sfida.`)
        conn.game[room.id] = room
    }
}

handler.help = ['tris']
handler.tags = ['game']
handler.command = /^(tris|tictactoe|ttc)$/i
handler.group = true

export default handler
