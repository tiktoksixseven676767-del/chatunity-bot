let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `[❗] Inserisci la quantità di UC. Esempio: ${usedPrefix + command} 1000`
    let amount = parseInt(text)
    if (isNaN(amount)) throw '[❗] La quantità deve essere un numero.'

    let groupMetadata = await conn.groupMetadata(m.chat)
    let participants = groupMetadata.participants
    let users = global.db.data.users

    for (let user of participants) {
        let jid = user.id
        if (users[jid]) {
            users[jid].money += amount
        } else {
            users[jid] = {
                messaggi: 0, blasphemy: 0, exp: 0, money: amount, warn: 0,
                joincount: 2, limit: 15000, premium: false, premiumDate: -1,
                name: conn.getName(jid), muto: false
            }
        }
    }

    m.reply(`✅ Accreditati ${amount} UC a tutti i ${participants.length} membri di questo gruppo.`)
}

handler.help = ['allgpuc <quantità>']
handler.tags = ['owner']
handler.command = ['allgpuc']
handler.group = true
handler.owner = true

export default handler
