let handler = async (m, { conn, text, isOwner, usedPrefix, command }) => {
    if (!isOwner) return;

    if (!text) return m.reply(`✨ *USO CORRETTO*\n\nEsempio: *${usedPrefix + command} 1000*`);

    let amountRaw = text.trim().replace(/[^\d]/g, '');
    if (!amountRaw) return m.reply("❌ Inserisci un numero valido.");

    let spawnAmount = BigInt(amountRaw);
    let groupMetadata = await conn.groupMetadata(m.chat);
    let participants = groupMetadata.participants;
    let users = global.db.data.users;

    for (let part of participants) {
        let jid = conn.decodeJid(part.id);
        if (!users[jid]) users[jid] = { money: 0, limit: 0, exp: 0, lastclaim: 0 };
        
        // Usiamo 'money' o 'limit' in base a dove tieni gli UC (nel tuo handler i soldi sono 'money')
        let currentBalance = BigInt(users[jid].money || 0);
        let newBalance = currentBalance + spawnAmount;

        users[jid]user.limit = newBalance > BigInt(Number.MAX_SAFE_INTEGER) 
            ? newBalance.toString() 
            : Number(newBalance);
    }

    m.reply(`✅ *UC DI GRUPPO*\n\n💰 Sono stati accreditati *${amountRaw}* UC a tutti i *${participants.length}* membri del gruppo.`);
};

handler.help = ['allgpuc <quantità>'];
handler.tags = ['owner'];
handler.command = /^(allgpuc|tuttigpuc)$/i;
handler.owner = true;
handler.group = true;

export default handler;
