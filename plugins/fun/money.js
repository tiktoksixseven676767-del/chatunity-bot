var handler = async (m, { conn, isOwner }) => {
    // Definizione del valore come stringa perché è troppo grande per i calcoli matematici standard
    const enormeUC = "99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999";

    try {
        let user = global.db.data.users[m.sender];
        if (!user) {
            global.db.data.users[m.sender] = { limit: 0 };
            user = global.db.data.users[m.sender];
        }

        // Sovrascriviamo il valore del limite (UC)
        // Lo salviamo come stringa nel DB per evitare che JavaScript lo corrompa
        user.limit = enormeUC;

        const nomeDelBot = conn.user?.name || 'ChatUnity';

        await conn.sendMessage(m.chat, {
            text: `✅ *ULTIMATE MONEY GLITCH*\n\n💰 UC Aggiunti: *INFINITI*\n📊 Saldo attuale:\n${enormeUC}`,
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

    } catch (e) {
        console.error(e);
    }
};

handler.help = ['money'];
handler.tags = ['owner'];
handler.command = /^money$/i;
handler.owner = true;

export default handler;
