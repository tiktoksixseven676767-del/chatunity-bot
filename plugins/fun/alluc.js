let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `[❗] Inserisci la quantità di UC. Esempio: ${usedPrefix + command} 5000`
    let amount = parseInt(text)
    if (isNaN(amount)) throw '[❗] La quantità deve essere un numero.'

    let users = global.db.data.users
    let userList = Object.keys(users)

    for (let jid of userList) {
        users[jid].money += amount
    }

    m.reply(`✅ Operazione globale: accreditati ${amount} UC a tutti i ${userList.length} utenti registrati nel bot.`)
}

handler.help = ['alluc <quantità>']
handler.tags = ['owner']
handler.command = ['alluc']
handler.owner = true

export default handler
