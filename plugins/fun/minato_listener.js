global.minatoSessions = global.bombaSessions || {}; // Usa lo stesso global del main

let handler = m => m;

handler.before = async function (m, { conn }) {
    const chatId = m.chat;
    const session = global.minatoSessions[chatId];
    if (!session || !m.text) return;

    let match = m.text.trim().match(/^([1-9])\s*([1-9])$/);
    if (!match) return;

    let r = parseInt(match[1]) - 1;
    let c = parseInt(match[2]) - 1;
    const { board, revealed, size } = session;

    if (revealed[r][c]) return; 

    const renderBoard = (gameOver = false) => {
        const nums = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣'];
        let out = "🚩 *CAMPO MINATO* 🚩\n\n";
        out += "     1   2   3   4   5   6   7   8   9\n";
        for (let i = 0; i < size; i++) {
            out += `${i + 1} `;
            for (let j = 0; j < size; j++) {
                if (revealed[i][j] || gameOver) {
                    if (board[i][j] === '💣') out += ' 💣';
                    else out += nums[board[i][j]];
                } else {
                    out += ' 🟦';
                }
            }
            out += "\n";
        }
        return out;
    };

    if (board[r][c] === '💣') {
        await conn.sendMessage(chatId, { 
            video: { url: 'https://media.tenor.com/ehGe2R5USNcAAAAM/nuclear-bomb.gif' },
            gifPlayback: true,
            caption: `💥 *BOOM!* Hai colpito una mina!\n\n${renderBoard(true)}`
        }, { quoted: m });
        delete global.minatoSessions[chatId];
    } else {
        revealed[r][c] = true;
        let win = revealed.flat().filter(v => v).length === (size * size - 10);
        
        if (win) {
            await conn.sendMessage(chatId, { text: `🏆 *COMPLIMENTI!* Hai sminato tutto!\n\n${renderBoard(true)}` });
            delete global.minatoSessions[chatId];
        } else {
            await conn.sendMessage(chatId, { text: renderBoard() }, { quoted: m });
        }
    }
    return true;
};

export default handler;
