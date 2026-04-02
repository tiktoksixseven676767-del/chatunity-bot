global.impiccato = global.impiccato || {};

let handler = async (m, { conn }) => {
    const chatId = m.chat;
    if (global.impiccato[chatId]) return m.reply("🏷️ C'è già una partita in corso!");

    const parole = ['MELA', 'BANANA', 'COMPUTER', 'PIZZA', 'CALCIO', 'CHITARRA', 'TELEFONO', 'STAZIONE', 'TRENO', 'LIBRO'];
    const scelta = parole[Math.floor(Math.random() * parole.length)];

    global.impiccato[chatId] = {
        parola: scelta,
        indovinate: [],
        errori: 0,
        maxErrori: 6
    };

    const s = global.impiccato[chatId];
    let display = s.parola.split('').map(l => s.indovinate.includes(l) ? l : '_').join(' ');

    // Nuova immagine generica (Link stabile)
    await conn.sendMessage(chatId, { 
        image: { url: 'https://cdn-icons-png.flaticon.com/512/4359/4359160.png' },
        caption: `🎮 *GIOCO DELL'IMPICCATO* 🎮\n\nParola: \`${display}\` \n\nErrori: ${s.errori}/${s.maxErrori}\n\nScrivi una lettera per iniziare!`
    }, { quoted: m });
};

handler.command = /^(impiccato|hang)$/i;
export default handler;
