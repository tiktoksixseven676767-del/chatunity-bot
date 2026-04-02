let handler = async (m, { isOwner, isAdmin, conn, text, participants, args, usedPrefix, command }) => {
    const userId = m.sender;
    const chatId = m.chat;
    const nomeDelBot = global.db.data.nomedelbot || 'ChatUnity';
    const cost = 100000; // Costo per i non-admin

    // LOGICA DI ACCESSO E PAGAMENTO
    let user = global.db.data.users[userId];
    const canTagFree = isAdmin || isOwner;

    if (!canTagFree) {
        // Se non è admin, controlla se ha abbastanza soldi
        if ((user.limit || 0) < cost) {
            return m.reply(`🚫 Non sei un Admin! Per usare questo comando devi pagare *${cost.toLocaleString()} UC*.\n\nIl tuo saldo attuale è: *${(user.limit || 0).toLocaleString()} UC*`);
        }
        
        // Sottrae i soldi
        user.limit -= cost;
        await m.reply(`🛍️ *Acquisto effettuato!*\nSono stati scalati *${cost.toLocaleString()} UC* dal tuo conto per invocare il gruppo.`);
    }

    // COSTRUZIONE DEL MESSAGGIO (Tua logica originale)
    const title = global.t('tagallTitle', userId, chatId);
    const botLabel = global.t('tagallBot', userId, chatId);
    const messageLabel = global.t('tagallMessage', userId, chatId);
    const emptyMessage = global.t('tagallEmptyMessage', userId, chatId);
    const memberCount = global.t('tagallMemberCount', userId, chatId, { count: participants.length });

    let message = args.join` ` || emptyMessage;

    let tagText = `${title}\n\n` +
               `꒷꒦ ✦ ୧・︶ : ︶ ꒷꒦ ‧₊ ୧\n` +
               `୧ ${botLabel}: ${nomeDelBot}\n` +
               `୧ ${messageLabel}: ${message}\n` +
               `୧ ${memberCount}\n` +
               `꒷꒦ ✦ ୧・︶ : ︶ ꒷꒦ ‧₊ ୧\n\n`;

    for (let user of participants) {
        tagText += `✧ @${user.id.split('@')[0]}\n`;
    }

    tagText += '\n╰♡꒷ ๑ ⋆˚₊⋆───ʚ˚ɞ───⋆˚₊⋆ ๑ ⪩';

    // INVIO MESSAGGIO CON TAG
    await conn.sendMessage(chatId, {
        text: tagText,
        mentions: participants.map(p => p.id),
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363259442839354@newsletter',
                serverMessageId: '',
                newsletterName: `${nomeDelBot}`
            }
        }
    }, { quoted: m });
};

handler.help = ['tagall <messaggio>'];
handler.tags = ['group'];
handler.command = /^(buytagall)$/i;
handler.group = true;
// handler.admin = true; // DISATTIVATO per permettere l'acquisto ai non-admin

export default handler;
