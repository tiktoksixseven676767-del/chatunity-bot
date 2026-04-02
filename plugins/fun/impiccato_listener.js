global.impiccato = global.impiccato || {};

let handler = m => m;

handler.before = async function (m, { conn }) {
    const chatId = m.chat;
    const s = global.impiccato[chatId];
    if (!s || !m.text || m.text.length !== 1) return;

    let lettera = m.text.toUpperCase();
    if (!/[A-Z]/.test(lettera)) return;

    if (s.indovinate.includes(lettera)) return; // Già provata
    s.indovinate.push(lettera);

    if (!s.parola.includes(lettera)) {
        s.errori++;
    }

    const render = () => {
        let display = s.parola.split('').map(l => s.indovinate.includes(l) ? l : '_').join(' ');
        return `🎮 *IMPICCATO* 🎮\n\nParola: \`${display}\` \n\nLettere provate: ${s.indovinate.join(', ')}\nErrori: ${s.errori}/${s.maxErrori}`;
    };

    // Controllo Vittoria
    if (s.parola.split('').every(l => s.indovinate.includes(l))) {
        await conn.sendMessage(chatId, { text: `🏆 *VINTO!* La parola era: *${s.parola}*` }, { quoted: m });
        delete global.impiccato[chatId];
    } 
    // Controllo Sconfitta
    else if (s.errori >= s.maxErrori) {
        await conn.sendMessage(chatId, { 
            video: { url: 'https://media.tenor.com/ehGe2R5USNcAAAAM/nuclear-bomb.gif' },
            gifPlayback: true,
            caption: `💀 *PERSO!* Sei stato impiccato.\nLa parola era: *${s.parola}*`
        }, { quoted: m });
        delete global.impiccato[chatId];
    } 
    // Continua a giocare
    else {
        await conn.sendMessage(chatId, { text: render() }, { quoted: m });
    }
    return true;
};

export default handler;
