let handler = async (m, { conn, usedPrefix, command }) => {
    // --- MODIFICA IL TESTO TRA LE VIRGOLETTE QUI SOTTO ---
    const testoInfo = `
✨ *BENVENUTO SU ${conn.user.name.toUpperCase()}* ✨

usa .compragrattaevinci {tipo} {quantità} per comprare i gratta e vinci 
ci sono i seguenti gratta e vinci 


Forziere 10k: 1 su 5 (Molto facile).
Forziere 100k: 1 su 15.
Milionario: 1 su 30.
Miliardario: 1 su 100 (Difficilissimo, ma premio enorme).

esempio 

.buygrattavinci 100k 5

per aprirli fai
.aprigrattavinci {tipo}

esempio 
.aprigrattavinci 100k.
📍 *Sviluppatore:* mazzu
🤖 *Versione:* x

Usa ${usedPrefix}menu per vedere tutti i comandi disponibili!
`.trim();
    // ----------------------------------------------------

    const nomeDelBot = conn.user?.name || 'ChatUnity';

    await conn.sendMessage(m.chat, {
        text: testoInfo,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363259442839354@newsletter',
                serverMessageId: '',
                newsletterName: nomeDelBot
            }
        }
    }, { quoted: m });
};

handler.help = ['info'];
handler.tags = ['main'];
handler.command = /^(infograttaevinci)$/i;

export default handler;
