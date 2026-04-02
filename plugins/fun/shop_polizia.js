let handler = async (m, { conn, usedPrefix }) => {
    let user = global.db.data.users[m.sender];
    const costoPolizia = 50000; // Imposta il prezzo (es. 50k UC)

    if (user.polizia) return m.reply("👮‍♂️ Hai già la protezione della Polizia attiva!");
    if ((user.limit || 0) < costoPolizia) return m.reply(`❌ Non hai abbastanza UC! Ti servono *${costoPolizia.toLocaleString()} UC*.`);

    user.limit -= costoPolizia;
    user.polizia = true;

    await conn.sendMessage(m.chat, {
        text: `👮‍♂️ *POLIZIA ACQUISTATA!*\n\nDa ora in poi, ogni volta che qualcuno proverà a rubarti degli UC, ne perderai solo il *50%*.\n\n💰 Saldo residuo: *${user.limit.toLocaleString()} UC*`,
        contextInfo: {
            externalAdReply: {
                title: "Sicurezza ChatUnity",
                body: "Protezione attiva 🛡️",
                thumbnailUrl: "https://static.vecteezy.com/ti/vettori-gratis/p3/2002235-polizia-stemma-vettoriale.jpg",
                sourceUrl: "",
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });
};

handler.command = ['acquistapolizia', 'buypolice'];
handler.group = true;
export default handler;
