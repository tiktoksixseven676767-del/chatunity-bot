global.tris = global.tris || {};

let handler = async (m, { conn, usedPrefix, command, text }) => {
    const chatId = m.chat;

    if (global.tris[chatId]) return m.reply("⚠️ C'è già una partita in corso in questo gruppo.");

    // Controlla se l'utente ha menzionato qualcuno da sfidare
    let b = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);
    if (!b) return m.reply(`Indica chi vuoi sfidare! Esempio: *${usedPrefix + command} @utente*`);
    if (b === m.sender) return m.reply("Non puoi sfidare te stesso! 😂");

    const board = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    global.tris[chatId] = {
        board,
        p1: m.sender, // X
        p2: b,        // O
        turn: m.sender,
        status: 'playing'
    };

    const renderBoard = (grid) => {
        return `🎮 *SFIDA A TRIS* 🎮\n\n` +
               `  ${grid[0]} | ${grid[1]} | ${grid[2]}\n` +
               `  ----------\n` +
               `  ${grid[3]} | ${grid[4]} | ${grid[5]}\n` +
               `  ----------\n` +
               `  ${grid[6]} | ${grid[7]} | ${grid[8]}\n\n` +
               `❌ @${m.sender.split('@')[0]}\n` +
               `⭕ @${b.split('@')[0]}\n\n` +
               `Tocca a: @${m.sender.split('@')[0]}\n` +
               `Digita un numero da 1 a 9 per giocare!`;
    };

    await conn.sendMessage(chatId, { 
        image: { url: 'https://static.vecteezy.com/ti/vettori-gratis/p1/6409900-tic-tac-toe-sketched-isolato-gioco-vintage-in-stile-disegnato-a-mano-vettoriale.jpg' },
        caption: renderBoard(board),
        mentions: [m.sender, b]
    }, { quoted: m });
};

handler.command = /^(tris|ttt)$/i;
handler.group = true;

export default handler;
