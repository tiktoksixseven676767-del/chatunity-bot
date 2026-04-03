let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];
    if (!user.gratta) user.gratta = { f10: 0, f100: 0, mil: 0, mrd: 0 };

    const tipi = {
        '10k': { id: 'f10', nome: 'Forziere 10k', costo: 3000, premio: 10000, prob: 5, imgVuoto: 'https://static.vecteezy.com/ti/vettori-gratis/p1/2311684-gratta-e-vinci-vettoriale.jpg' },
        '100k': { id: 'f100', nome: 'Forziere 100k', costo: 10000, premio: 100000, prob: 15, imgVinto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEQOPcBWGrdr9nBhuqfvO7V-jw1VLhKhc4C8nQZmXIJw&s=10', imgPerso: 'https://storage.ilcittadino.it/media/photologue/2024/12/15/photos/cache/i-gratta-e-vinci-in-un-campo-si-cerca-il-luogo-del-furto_1e0de442-bac0-11ef-8ded-b5c6956f8d3f_1080_1080_new_square_large.webp' },
        'milionario': { id: 'mil', nome: 'Milionario', costo: 30000, premio: 1000000, prob: 30, imgVinto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjo0kv9X9JYcdmcrqWSUBZo3vyqlT_prw1oxFA0mllrw&s=10', imgPerso: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXQIR_YHPlULS99rLcHTfijQ9sgjluiOfZVfiIz8dFMg&s=10' },
        'miliardario': { id: 'mrd', nome: 'Miliardario', costo: 50000, premio: 1000000000, prob: 100, imgVinto: null, imgPerso: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZg9xKwjRC3-rRIeMPhlvIhHdhXKzetk9-xCHo1kOb4Q&s=10' }
    };

    if (command === 'inventariograttavinci') {
        return m.reply(`📦 *IL TUO INVENTARIO*\n\n💰 Forziere 10k: ${user.gratta.f10}\n💎 Forziere 100k: ${user.gratta.f100}\n🏆 Milionario: ${user.gratta.mil}\n👑 Miliardario: ${user.gratta.mrd}\n\nUsa *${usedPrefix}aprigrattavinci {tipo}*`);
    }

    if (command === 'buygrattavinci') {
        let type = args[0]?.toLowerCase();
        let qty = parseInt(args[1]) || 1;
        if (!tipi[type]) return m.reply(`❌ Esempio: ${usedPrefix}${command} 100k 1`);
        let spesa = tipi[type].costo * qty;
        if (user.limit < spesa) return m.reply(`🚫 UC insufficienti!`);
        user.limit -= spesa;
        user.gratta[tipi[type].id] += qty;
        return m.reply(`✅ Hai comprato ${qty} ${tipi[type].nome}!`);
    }

    if (command === 'aprigrattavinci') {
        let type = args[0]?.toLowerCase();
        if (!tipi[type] || user.gratta[tipi[type].id] < 1) return m.reply(`❌ Non ne hai di questo tipo.`);

        user.gratta[tipi[type].id] -= 1;
        let t = tipi[type];

        // Foto "Apertura in corso" (Ho cambiato il link con uno più generico e pulito)
        await conn.sendMessage(m.chat, { 
            image: { url: 'https://img.freepik.com/premium-vector/scratch-card-game-concept-win-prize-lottery-fortune-ticket-vector-stock-illustration_100456-11326.jpg' }, 
            caption: `🎰 Apertura del *${t.nome}*...` 
        }, { quoted: m });

        setTimeout(async () => {
            let win = Math.floor(Math.random() * t.prob) === 0;
            if (win) user.limit += t.premio;

            let img = win ? t.imgVinto : t.imgPerso;
            let txt = win ? `🎉 HAI VINTO *${t.premio.toLocaleString()} UC*!` : `🤡 HAI PERSO! Non c'è niente sotto la polvere.`;

            if (img) {
                await conn.sendMessage(m.chat, { image: { url: img }, caption: txt }, { quoted: m });
            } else {
                await m.reply(txt);
            }
        }, 3000);
    }
};

handler.help = ['buygrattavinci', 'aprigrattavinci', 'inventariograttavinci'];
handler.tags = ['rpg'];
handler.command = /^(buygrattavinci|aprigrattavinci|inventariograttavinci)$/i;
export default handler;
