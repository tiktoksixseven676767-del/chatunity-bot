let handler = async (m, { conn, participants }) => {
    let users = global.db.data.users
    // Trasformiamo l'oggetto users in un array per poterlo ordinare
    let sortedData = Object.entries(users).map(([jid, data]) => {
        return {
            jid,
            name: data.name || conn.getName(jid) || 'Utente Misterioso',
            // Calcoliamo il totale: contanti + banca
            total: (data.limit || 0) + (data.bank || 0)
        }
    }).sort((a, b) => b.total - a.total) // Ordiniamo dal più ricco al più povero

    // Prendiamo i primi 10
    let top10 = sortedData.slice(0, 10)
    
    let text = `🏆 *CLASSIFICA RICCHEZZA UNITY* 🏆\n\n`
    
    top10.forEach((user, i) => {
        let medal = ''
        if (i === 0) medal = '🥇 '
        else if (i === 1) medal = '🥈 '
        else if (i === 2) medal = '🥉 '
        else medal = `${i + 1}. `
        
        text += `${medal}*${user.name.replaceAll('\n', '')}*\n`
        text += `   💰 Totale: ${formatNumber(user.total)} UC\n\n`
    })

    text += `_Vuoi scalare la vetta? Gioca al .blackjack o lavora!_`

    await conn.sendMessage(m.chat, { 
        text: text,
        contextInfo: {
            mentionedJid: top10.map(v => v.jid)
        }
    }, { quoted: m })
}

handler.help = ['classifica']
handler.tags = ['economy']
handler.command = /^(classifica|leaderboard|lb|top)$/i

export default handler

function formatNumber(num) {
    return new Intl.NumberFormat('it-IT').format(num)
}
