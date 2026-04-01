global.minatoSessions = global.minatoSessions || {};

let handler = async (m, { conn, usedPrefix, command }) => {
    const chatId = m.chat;
    if (global.minatoSessions[chatId]) return m.reply("💣 Hai già una partita in corso! Scrivi le coordinate (es: 1 5)");

    const size = 9;
    const bombsCount = 10;
    let board = Array(size).fill().map(() => Array(size).fill(0));
    let revealed = Array(size).fill().map(() => Array(size).fill(false));

    let placed = 0;
    while (placed < bombsCount) {
        let r = Math.floor(Math.random() * size);
        let c = Math.floor(Math.random() * size);
        if (board[r][c] !== '💣') {
            board[r][c] = '💣';
            placed++;
        }
    }

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (board[r][c] === '💣') continue;
            let count = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (board[r + i]?.[c + j] === '💣') count++;
                }
            }
            board[r][c] = count;
        }
    }

    global.minatoSessions[chatId] = { board, revealed, size, status: 'playing', lastMsg: null };

    const render = () => {
        // Spaziatura migliorata per l'intestazione
        let out = "🚩 *CAMPO MINATO 9x9* 🚩\n\n";
        out += "1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣\n"; 
        for (let r = 0; r < size; r++) {
            out += `${r + 1}  🟦🟦🟦🟦🟦🟦🟦🟦🟦\n`;
        }
        out += "\nScrivi *Riga Spazio Colonna* (es: *3 5*)";
        return out;
    };

    let msg = await conn.sendMessage(chatId, { 
        image: { url: 'https://cdn-icons-png.flaticon.com/512/3505/3505500.png' },
        caption: render() 
    });
    global.minatoSessions[chatId].lastMsg = msg.key.id;
};

handler.command = /^(minato|mines)$/i;
export default handler;
