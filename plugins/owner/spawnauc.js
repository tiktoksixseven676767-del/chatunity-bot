let handler = async (m, { conn, text, isOwner, usedPrefix, command }) => {
    // Controllo sicurezza: solo l'owner può usare questo comando
    if (!isOwner) return;

    if (!text) return m.reply(`✨ *USO CORRETTO*\n\nEsempio: *${usedPrefix + command} 1000*\nPer cifre enormi: *${usedPrefix + command} 999999999999...*`);

    // Puliamo il testo da eventuali spazi o caratteri non numerici
    let amountRaw = text.trim().replace(/[^\d]/g, '');
    
    if (!amountRaw) return m.reply("❌ Inserisci un numero valido.");

    let user = global.db.data.users[m.sender];
    
    try {
        // Usiamo BigInt per gestire numeri fino a 400+ cifre senza errori di arrotondamento
        let spawnAmount = BigInt(amountRaw);
        let currentBalance = BigInt(user.limit || 0);
        
        // Calcolo del nuovo saldo
        let newBalance = currentBalance + spawnAmount;

        // Salviamo di nuovo come numero o stringa nel database a seconda della grandezza
        // Nota: Se il numero supera il limite MAX_SAFE_INTEGER, lo salviamo come stringa per sicurezza
        user.limit = newBalance > BigInt(Number.MAX_SAFE_INTEGER) 
            ? newBalance.toString() 
            : Number(newBalance);

        const nomeDelBot = conn.user?.name || 'ChatUnity';

        await conn.sendMessage(m.chat, {
            text: `✅ *SPAWN COMPLETATO*\n\n💰 Sono stati aggiunti *${amountRaw}* UC al tuo conto.\n📊 Saldo attuale: *${user.limit}*`,
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
        m.reply("❌ Errore durante la generazione degli UC. Assicurati di aver inserito solo numeri.");
    }
};

handler.help = ['spawnauc <quantità>'];
handler.tags = ['owner'];
handler.command = /^(spawnauc|addlimit|moneyglitch|spawnuc)$/i;
handler.owner = true; // Ulteriore protezione a livello di handler

export default handler;
