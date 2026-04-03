let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];
    if (!user.gratta) user.gratta = { f10: 0, f100: 0, mil: 0, mrd: 0 };

    const tipi = {
        '10k': { id: 'f10', nome: 'Forziere 10k', costo: 3000, premio: 10000, prob: 5, imgVuoto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_uN8a1kI-U8G_Y7YwO_wU0oR3q6U7v7XWKg&s' },
        '100k': { id: 'f100', nome: 'Forziere 100k', costo: 10000, premio: 100000, prob: 15, imgVinto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEQOPcBWGrdr9nBhuqfvO7V-jw1VLhKhc4C8nQZmXIJw&s=10', imgPerso: 'https://storage.ilcittadino.it/media/photologue/2024/12/15/photos/cache/i-gratta-e-vinci-in-un-campo-si-cerca-il-luogo-del-furto_1e0de442-bac0-11ef-8ded-b5c6956f8d3f_1080_1080_new_square_large.webp' },
        'milionario': { id: 'mil', nome: 'Milionario', costo: 30000, premio: 1000000, prob: 30, imgVinto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjo0kv9X9JYcdmcrqWSUBZo3vyqlT_prw1oxFA0mllrw&s=10', imgPerso: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXQIR_YHPlULS99rLcHTfijQ9sgjluiOfZVfiIz8dFMg&s=10' },
        'miliardario': { id: 'mrd', nome: 'Miliardario', costo: 50000, premio: 1000000000, prob: 100, imgVinto: null, imgPerso: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZg9xKwjRC3-rRIeMPhlvIhHdhXKzetk9-xCHo1kOb4Q&s=10' }
    };

    // --- COMANDO INVENTARIO ---
    if (command === 'inventariograttavinci') {
        let txt = `📦 *IL TUO INVENTARIO*\n\n`;
        txt += `💰 Forziere 10k: ${user.gratta.f10}\n`;
        txt += `💎 Forziere 100k: ${user.gratta.f100}\n`;
        txt += `🏆 Milionario: ${user.gratta.mil}\n`;
        txt += `👑 Miliardario: ${user.gratta.mrd}\n\n`;
        txt += `Usa *${usedPrefix}aprigrattavinci {nome}* per giocare!`;
        return m.reply(txt);
    }

    // --- COMANDO ACQUISTO ---
    if (command === 'buygrattavinci') {
        let type = args[0]?.toLowerCase();
        let qty = parseInt(args[1]) || 1;
        if (!tipi[type]) return m.reply(`❌ Specifica un tipo: ${Object.keys(tipi).join(', ')}`);
        
        let spesa = tipi[type].costo * qty;
        if (user.limit < spesa) return m.reply(`🚫 Non hai abbastanza UC! Ti servono ${spesa} UC.`);
        
        user.limit -= spesa;
        user.gratta[tipi[type].id] += qty;
        return m.reply(`✅ Hai acquistato ${qty} *${tipi[type].nome}* per ${spesa} UC!`);
    }

    // --- COMANDO APERTURA ---
    if (command === 'aprigrattavinci') {
        let type = args[0]?.toLowerCase();
        if (!tipi[type]) return m.reply(`❌ Quale vuoi aprire? Usa: ${Object.keys(tipi).join(', ')}`);
        if (user.gratta[tipi[type].id] < 1) return m.reply(`🚫 Non ne hai nell'inventario!`);

        user.gratta[tipi[type].id] -= 1;
        let t = tipi[type];

        // 1. Messaggio di attesa (Foto vuota generica o specifica)
        await conn.sendMessage(m.chat, { 
            image: { url: 'https://static.vecteezy.com/ti/vettori-gratis/p1/2311684-gratta-e-vinci-vettoriale.jpg' }, 
            caption: `🎰 Apertura del *${t.nome}* in corso...` 
        }, { quoted: m });

        await new Promise(resolve => setTimeout(resolve, 2000));

        // 2. Calcolo vittoria
        let win = Math.floor(Math.random() * t.prob) === 0;
        let img = win ? t.imgVinto : t.imgPerso;
        let testo = win ? `🎉 HAI VINTO ${t.premio.toLocaleString()} UC!

📍 *Sviluppatore:* mazzu
🤖 *Versione:* x` : `🤡 HAI PERSO! Ritenta sarai più fortunato.

📍 *Sviluppatore:* mazzu
🤖 *Versione:* x`;

        if (win) user.limit += t.premio;

        if (img) {
            await conn.sendMessage(m.chat, { image: { url: img }, caption: testo }, { quoted: m });
        } else {
            await m.reply(testo);
        }
    }
};

handler.help = ['buygrattavinci', 'aprigrattavinci', 'inventariograttavinci'];
handler.tags = ['rpg'];
handler.command = /^(buygrattavinci|aprigrattavinci|inventariograttavinci)$/i;

export default handler;
