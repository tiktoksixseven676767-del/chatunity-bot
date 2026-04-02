global.impiccato = global.impiccato || {};

let handler = async (m, { conn, text }) => {
    const chatId = m.chat;
    if (global.impiccato[chatId]) return m.reply("🏷️ C'è già una partita in corso! Indovina le lettere.");

    const parole = ['MELA', 'BANANA', 'COMPUTER', 'WHATSAPP', 'PIZZA', 'CALCIO', 'CHITARRA', 'MONTAGNA', 'TELEFONO', 'STAZIONE'];
    const scelta = parole[Math.floor(Math.random() * parole.length)];

    global.impiccato[chatId] = {
        parola: scelta,
        indovinate: [],
        errori: 0,
        maxErrori: 6,
        lastMsg: null
    };

    const render = (s) => {
        let display = s.parola.split('').map(l => s.indovinate.includes(l) ? l : '_').join(' ');
        return `🎮 *GIOCO DELL'IMPICCATO* 🎮\n\nParola: \`${display}\` \n\nErrori: ${s.errori}/${s.maxErrori}\nScrivi una lettera per giocare!`;
    };

    let msg = await conn.sendMessage(chatId, { 
        image: { url: 'https://cdn-icons-png.flaticon.com/512/1155/1155383.png' },
        caption: render(global.impiccato[chatId]) 
    });
    global.impiccato[chatId].lastMsg = msg.key.id;
};

handler.command = /^(impiccato|hang)$/i;
export default handler;
