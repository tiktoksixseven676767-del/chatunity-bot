global.impiccato = global.impiccato || {};

let handler = async (m, { conn }) => {
    const chatId = m.chat;
    if (global.impiccato[chatId]) return m.reply("🏷️ C'è già una partita! Indovina una lettera.");

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

    // Immagine fissa per l'inizio (URL Diretto)
    await conn.sendMessage(chatId, { 
        image: { url: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/game/hangman.jpg' },
        caption: `🎮 *GIOCO DELL'IMPICCATO* 🎮\n\nParola: \`${display}\` \n\nErrori: ${s.errori}/${s.maxErrori}\n\nScrivi una lettera (es: *A*) per giocare!`
    }, { quoted: m });
};

handler.command = /^(impiccato|hang)$/i;
export default handler;
