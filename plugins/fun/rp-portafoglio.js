import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix }) => {
    let rcanal = null

    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let user = global.db.data.users[who]
    let name = conn.getName(who)

    if (!(who in global.db.data.users)) throw '🚩 𝐢𝐥 bot 𝐧𝐨𝐧 𝐞 𝐬𝐭𝐚𝐭𝐨 𝐭𝐫𝐨𝐯𝐚𝐭𝐨 𝐧𝐞𝐥 𝐝𝐚𝐭𝐚𝐛𝐚𝐬𝐞'


    if (!user.limit) user.limit = 15000
    if (!user.bank) user.bank = 0

    let userbank = user.bank
    let imgUrl = 'https://i.ibb.co/4RSNsdx9/Sponge-Bob-friendship-wallet-meme-9.png'
    let message = `
╭─「 💰 𝐖𝐀𝐋𝐋𝐄𝐓」─
│
│ 👤 user: ${name}
│ 💰 unitycoins: ${formatNumber(user.limit)} 💶
│ 🏛️ bank: ${formatNumber(userbank)} 💳
│
╰───────✦───────
    `.trim()

    await conn.sendMessage(m.chat, { 
        text: message,
        contextInfo: {
            forwardingScore: 99,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363259442839354@newsletter',
                serverMessageId: '',
                newsletterName: 'ChatUnity'
            }
        }
    }, { quoted: m, detectLink: true });
    return;

    let txt = `
╭─「 💰 𝐖𝐀𝐋𝐋𝐄𝐓」─
│
│ 👤 user: ${name}
│ 💰 unitycoins: ${formatNumber(user.limit)} 💶
│ 🏛️ bank: ${formatNumber(userbank)} 💳
│
╰───────✦───────
    `.trim()

    await conn.sendMessage(m.chat, {
        text: txt,
        mentions: [who],
        contextInfo: {
            externalAdReply: {
                title: `𝐩𝐨𝐫𝐭𝐚𝐟𝐨𝐠𝐥𝐢𝐨 𝐝𝐢 ${name}`,
                body: `𝐬𝐚𝐥𝐝𝐨: ${user.limit} 𝑼𝑪`,
                thumbnailUrl: imgUrl,
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    })

    m.react('💶')
}

handler.help = ['wallet']
handler.tags = ['economy']
handler.command = ['soldi', 'wallet', 'portafoglio', 'uc', 'saldo', 'unitycoins']
handler.register = true

export default handler

function formatNumber(num) {
    return new Intl.NumberFormat('it-IT').format(num)
}