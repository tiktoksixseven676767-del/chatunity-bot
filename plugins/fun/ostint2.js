import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
  let bio = await conn.fetchStatus(who).catch(_ => 'Nessuna Bio')
  let snumber = who.split('@')[0]
  
  await conn.sendMessage(m.chat, { react: { text: "🔍", key: m.key } })

  try {
    // API GRATUITA: Analisi del prefisso internazionale per capire la provenienza
    // Usiamo un'API di info sui prefissi telefonici (gratis)
    let res = await fetch(`https://restcountries.com/v3.1/callingcode/${snumber.slice(0, 2)}`)
    let countryData = await res.json()
    
    let nazione = countryData[0]?.name?.common || 'Sconosciuta'
    let bandiera = countryData[0]?.flag || '❓'

    // Recupero foto profilo
    let pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png')

    let caption = `『 🕵️‍♂️ *MINI OSINT* 🕵️‍♂️ 』\n\n`
    caption += `*• Tag:* @${snumber}\n`
    caption += `*• Numero:* ${snumber}\n`
    caption += `*• Wa.me:* https://wa.me/${snumber}\n`
    caption += `*• Bio:* ${bio.status || bio}\n`
    caption += `*• Origine:* ${nazione} ${bandiera}\n\n`
    caption += `*✧ Info:* Questo tool analizza i dati pubblici disponibili sul profilo WhatsApp taggato.`

    await conn.sendFile(m.chat, pp, 'osint.jpg', caption, m, false, { mentions: [who] })
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '❌ Errore durante l\'analisi.', m)
  }
}

handler.help = ['osint @tag']
handler.tags = ['tools']
handler.command = /^(osint|info|check)$/i

export default handler
