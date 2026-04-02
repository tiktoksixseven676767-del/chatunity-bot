global.impiccato = global.impiccato || {};

let handler = m => m;

handler.before = async function (m, { conn }) {
    const chatId = m.chat;
    const s = global.impiccato[chatId];
    
    // Filtro: deve esserci una sessione e il messaggio deve essere di una sola lettera
    if (!s || !m.text || m.text.length !== 1) return;
    
    let lettera = m.text.toUpperCase();
    if (!/[A-Z]/.test(lettera)) return;

    if (s.indovinate.includes(lettera)) return; 
    s.indovinate.push(lettera);

    if (!s.parola.includes(lettera)) {
        s.errori++;
    }

    let display = s.parola.split('').map(l => s.indovinate.includes(l) ? l : '_').join(' ');

    // VITTORIA
    if (s.parola.split('').every(l => s.indovinate.includes(l))) {
        await conn.sendMessage(chatId, { text: `🏆 *VINTO!* Complimenti!\nLa parola era: *${s.parola}*` }, { quoted: m });
        delete global.impiccato[chatId];
        return true;
    } 

    // SCONFITTA (Esplosione)
    if (s.errori >= s.maxErrori) {
        await conn.sendMessage(chatId, { 
            video: { url: 'https://raw.githubusercontent.com/BrunoSobrino/TheMystic-Bot-MD/master/src/game/explocion.mp4' },
            gifPlayback: true,
            caption: `💀 *PERSO!* Sei stato polverizzato.\nLa parola era: *${s.parola}*`
        }, { quoted: m });
        delete global.impiccato[chatId];
        return true;
    } 

    // AGGIORNAMENTO STATO
    await m.reply(`🎮 *IMPICCATO*\n\nParola: \`${display}\` \n\nLettere: ${s.indovinate.join(', ')}\nErrori: ${s.errori}/${s.maxErrori}`);
    return true;
};

export default handler;
