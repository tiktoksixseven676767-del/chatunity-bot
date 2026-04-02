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
// 💀 SCONFITTA (Con immagine Game Over)
if (s.errori >= s.maxErrori) {
    let textLost = `💀 *GAME OVER* 💀\n\nSei stato eliminato! La parola era: *${s.parola}*`;
    
    try {
        await conn.sendMessage(chatId, { 
            image: { url: 'https://neonflexmood.com/cdn/shop/files/Game_Over7_600x.png?v=1712936328' },
            caption: textLost
        }, { quoted: m });
    } catch (e) {
        await conn.sendMessage(chatId, { text: textLost }, { quoted: m });
    } finally {
        delete global.impiccato[chatId];
    }
    return true;
}


    // AGGIORNAMENTO STATO
    await m.reply(`🎮 *IMPICCATO*\n\nParola: \`${display}\` \n\nLettere: ${s.indovinate.join(', ')}\nErrori: ${s.errori}/${s.maxErrori}`);
    return true;
};

export default handler;
