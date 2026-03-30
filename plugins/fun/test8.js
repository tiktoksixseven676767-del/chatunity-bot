import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return await conn.reply(m.chat, ,`DIO CANE BASTARDO IPNOTIZZATO E MASTURBATO DALLA MADONNA EBREA CREMATA NEI CAMPI DI CONCENTRAMENTO`

\`Esempio:\` *${usedPrefix}${command} varebot*`, m)
    }
    let waitMessage = await conn.reply(m.chat, '*🔍 Ricerca in corso...*', m)

    try {
        let api = `https://dark-core-api.vercel.app/api/search/github?key=api&text=${encodeURIComponent(text)}`;
        let response = await fetch(api);
        let json = await response.json();

        if (!json.results?.length) {
            await conn.sendMessage(m.chat, { 
                text: '『 ❌ 』- *Nessun risultato trovato.*',
                edit: waitMessage.key
            })
            return
        }

        let result = json.results[0];
        let formattedDate = new Date(result.createdAt).toLocaleDateString('it-IT')

        let txt = `ㅤㅤ⋆｡˚『 ╭ \`GITHUB\` ╯ 』˚｡⋆\n╭\n│
『 📌 』 \`Nome:\` *${result.name}*
『 👤 』 \`Creatore:\` *${result.creator}*
『 📅 』 \`Creato il:\` *${formattedDate}*
『 ⭐ 』 \`Stelle:\` *${result.stars}*
『 🔄 』 \`Fork:\` *${result.forks}*
『 ⛓️‍💥 』 \`Link:\` ${result.cloneUrl}
『 📝 』 \`Descrizione:\` 
│ ➤ ${result.description || '_Nessuna descrizione_'}
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`

        await conn.sendMessage(m.chat, {
            text: txt,
            edit: waitMessage.key
        })

    } catch (error) {
        console.error('Errore nella ricerca GitHub:', error)
        await conn.sendMessage(m.chat, {
            text: '❌ *Si è verificato un errore durante la ricerca.*',
            edit: waitMessage.key
        })
    }
}

handler.help = ['githubsearch', 'ghsearch']
handler.tags = ['ricerca']
handler.command = /^(githubsearch|ghsearch|minorenni)$/i

export default handler