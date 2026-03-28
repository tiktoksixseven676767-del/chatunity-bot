import fetch from 'node-fetch';

let tassa = 0.02; // 2% di tassa sulle transazioni

function formatNumber(num) {
    return new Intl.NumberFormat('it-IT').format(num);
}

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    
    // Newsletter globale ChatUnity
    const cuContext = {
        isForwarded: true,
        forwardingScore: 999,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363259442839354@newsletter',
            serverMessageId: 100,
            newsletterName: `𝐂𝐡𝐚𝐭𝐔𝐧𝐢𝐭𝐲-𝐁𝐨𝐭 ✦ Bonifico`
        }
    };

    // 1. Determina il destinatario (taggato o citato)
    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : null;

    if (!who) {
        return conn.sendMessage(m.chat, { 
            text: `୧・︶ ⚠️ ︶・୨ \`Devi taggare o rispondere all'utente a cui inviare i fondi.\`\n✦ Esempio: *${usedPrefix}${command} @utente 100* ꒷꒦`, 
            contextInfo: cuContext 
        }, { quoted: m });
    }

    if (who === m.sender) {
        return conn.sendMessage(m.chat, { 
            text: `୧・︶ ⚠️ ︶・୨ \`Non puoi fare un bonifico a te stesso!\` ꒷꒦`, 
            contextInfo: cuContext 
        }, { quoted: m });
    }

    // 2. Trova l'importo in modo intelligente (cerca il primo argomento che è un numero e non un tag)
    let amountStr = args.find(a => !isNaN(a.replace(/[^0-9]/g, '')) && !a.includes('@'));
    if (!amountStr) {
        return conn.sendMessage(m.chat, { 
            text: `୧・︶ ⚠️ ︶・୨ \`Inserisci l'importo da trasferire.\`\n✦ Esempio: *${usedPrefix}${command} @utente 100* ꒷꒦`, 
            contextInfo: cuContext 
        }, { quoted: m });
    }

    let Unitycoins = parseInt(amountStr.replace(/[^0-9]/g, ''));
    if (isNaN(Unitycoins) || Unitycoins <= 0) {
        return conn.sendMessage(m.chat, { 
            text: `୧・︶ ⚠️ ︶・୨ \`Importo non valido.\` ꒷꒦`, 
            contextInfo: cuContext 
        }, { quoted: m });
    }

    // 3. Calcolo tasse e costi
    let tassaImporto = Math.ceil(Unitycoins * tassa);
    let costoTotale = Unitycoins + tassaImporto;
    
    let users = global.db.data.users;
    
    // 4. Inizializzazione sicura database
    if (!users[m.sender]) users[m.sender] = { limit: 0 };
    if (!users[who]) users[who] = { limit: 0 };
    if (typeof users[m.sender].limit !== 'number') users[m.sender].limit = 0;
    if (typeof users[who].limit !== 'number') users[who].limit = 0;
    
    // 5. Verifica saldo
    if (users[m.sender].limit < costoTotale) {
        return conn.sendMessage(m.chat, { 
            text: `୧・︶ 💸 ︶・୨ \`Fondi insufficienti per coprire l'importo e la tassa bancaria del 2%!\`\n✦ Costo totale transazione: *${formatNumber(costoTotale)} UC*\n✦ Saldo in tasca: *${formatNumber(users[m.sender].limit)} UC* ꒷꒦`, 
            contextInfo: cuContext 
        }, { quoted: m });
    }
    
    // 6. Esegui la transazione
    users[m.sender].limit -= costoTotale;
    users[who].limit += Unitycoins;
    
    // 7. Ricevuta per il mittente
    let testoMittente = `
୧・︶ ✦ 𝐂𝐡𝐚𝐭𝐔𝐧𝐢𝐭𝐲-𝐁𝐨𝐭 ✦ ︶・୨
꒷꒦ ‧₊ 💸 𝐁𝐎𝐍𝐈𝐅𝐈𝐂𝐎 𝐈𝐍𝐕𝐈𝐀𝐓𝐎 ₊‧ ꒷꒦
୧・︶ : ︶ : ︶ : ︶ : ︶ : ︶ : ︶・୨

✦ 👤 𝐃𝐞𝐬𝐭𝐢𝐧𝐚𝐭𝐚𝐫𝐢𝐨: @${who.split('@')[0]}
✦ 💰 𝐈𝐦𝐩𝐨𝐫𝐭𝐨: ${formatNumber(Unitycoins)} UC
✦ 🏦 𝐓𝐚𝐬𝐬𝐚 (2%): ${formatNumber(tassaImporto)} UC

╭── 🧾 𝐑𝐄𝐏𝐎𝐑𝐓 ──⬣
│ 💳 𝐓𝐨𝐭𝐚𝐥𝐞 𝐏𝐚𝐠𝐚𝐭𝐨: ${formatNumber(costoTotale)} UC
│ 💼 𝐒𝐚𝐥𝐝𝐨 𝐑𝐞𝐬𝐢𝐝𝐮𝐨: ${formatNumber(users[m.sender].limit)} UC
╰───────────────⬣

👑 _Transazione completata con successo._
୧・︶ : ︶ ꒷꒦ ‧₊ ୧`.trim();

    await conn.sendMessage(m.chat, {
        text: testoMittente,
        mentions: [who],
        contextInfo: cuContext
    }, { quoted: m });
    
    // 8. Notifica diretta per il destinatario
    let testoDestinatario = `
୧・︶ ✦ 𝐂𝐡𝐚𝐭𝐔𝐧𝐢𝐭𝐲-𝐁𝐨𝐭 ✦ ︶・୨
꒷꒦ ‧₊ 📥 𝐁𝐎𝐍𝐈𝐅𝐈𝐂𝐎 𝐑𝐈𝐂𝐄𝐕𝐔𝐓𝐎 ₊‧ ꒷꒦
୧・︶ : ︶ : ︶ : ︶ : ︶ : ︶ : ︶・୨

✦ 👤 𝐌𝐢𝐭𝐭𝐞𝐧𝐭𝐞: @${m.sender.split('@')[0]}
✦ 💰 𝐈𝐦𝐩𝐨𝐫𝐭𝐨: +${formatNumber(Unitycoins)} UC
✦ 💼 𝐍𝐮𝐨𝐯𝐨 𝐒𝐚𝐥𝐝𝐨: ${formatNumber(users[who].limit)} UC

👑 _I fondi sono stati aggiunti al tuo portafoglio._
୧・︶ : ︶ ꒷꒦ ‧₊ ୧`.trim();

    // Il try/catch previene crash se il bot non può mandare messaggi in chat privata al destinatario
    try {
        await conn.sendMessage(who, {
            text: testoDestinatario,
            mentions: [m.sender],
            contextInfo: cuContext
        });
    } catch (e) {
        console.log("Impossibile inviare la notifica privata al destinatario.");
    }

    // Reazione di successo
    await conn.sendMessage(m.chat, { 
        react: { text: '💸', key: m.key }
    });
};

handler.help = ['transfer @user <amount>', 'bonifico @user <amount>'];
handler.tags = ['economy'];
handler.command = /^(pay|transfer|bonifico|trasferisci|paga|donauc)$/i;
handler.register = true;

export default handler;