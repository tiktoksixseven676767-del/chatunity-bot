global.impiccato = global.impiccato || {};

let handler = m => m;

handler.before = async function (m, { conn }) {
    const chatId = m.chat;
    const s = global.impiccato[chatId];
    
    if (!s || !m.text || m.text.length !== 1) return;
    
    let lettera = m.text.toUpperCase();
    if (!/[A-Z]/.test(lettera)) return;

    if (s.indovinate.includes(lettera)) return; 
    s.indovinate.push(lettera);

    if (!s.parola.includes(lettera)) {
        s.errori++;
    }

    let display = s.parola.split('').map(l => s.indovinate.includes(l) ? l : '_').join(' ');

    if (s.parola.split('').every(l => s.indovinate.includes(l))) {
        await conn.sendMessage(chatId, { text: `🏆 *VINTO!* \nLa parola era: *${s.parola}*` }, { quoted: m });
        delete global.impiccato[chatId];
        return true;
    } 

    if (s.errori >= s.maxErrori) {
        // Link video alternativo testato per l'esplosione
        await conn.sendMessage(chatId, { 
            video: { url: 'https://media.rawline.com/nuclear_explosion.mp4' }, 
            gifPlayback: true,
            caption: `💀 *PERSO!* La parola era: *${s.parola}*`
        }, { quoted: m }).catch(async () => {
            // Fallback se il video fallisce: invia solo testo
            await m.reply(`💀 *BOOM!* Hai perso. La parola era: *${s.parola}*`);
        });
        delete global.impiccato[chatId];
        return true;
    } 

    await m.reply(`🎮 *IMPICCATO*\n\nParola: \`${display}\` \nErrori: ${s.errori}/${s.maxErrori}`);
    return true;
};

export default handler;
