import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.sender
  let snumber = who.split('@')[0]
  
  // Animazione caricamento
  let { key } = await conn.sendMessage(m.chat, { text: '`[SYSTEM]: Inizializzazione scansione Social...`' }, { quoted: m })
  const edit = async (txt) => await conn.sendMessage(m.chat, { text: txt, edit: key })

  try {
    await edit('`[ANALISI]: Tracking impronta digitale...`')
    let bio = await conn.fetchStatus(who).catch(_ => 'Privata')
    let pushname = conn.getName(who) || 'Sconosciuto'
    let pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png')
    
    // Check Business
    let isBusiness = false
    try {
        const busi = await conn.getBusinessProfile(who)
        if (busi) isBusiness = true
    } catch (e) { isBusiness = false }

    await edit('`[ANALISI]: Generazione link sociali... [||||||] 70%`')
    
    let prefix = snumber.slice(0, 2)
    let resCountry = await fetch(`https://restcountries.com/v3.1/callingcode/${prefix}`)
    let c = await resCountry.json()
    let country = c[0] || {}

    let report = `
🔍 *ARCHIVIO INTELLIGENCE AVANZATO* 🔍
  
┏━━━━━━━『 *IDENTITÀ* 』━━━━━━━┓
┃ 👤 *NOME:* ${pushname}
┃ 💼 *TIPO:* ${isBusiness ? 'BUSINESS' : 'PERSONALE'}
┃ 💬 *WHATSAPP:* wa.me/${snumber}
┃ 🏷️ *BIO:* ${bio.status || bio}
┃ 🚩 *ORIGINE:* ${country.name?.common || 'N/A'} ${country.flag || ''}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━『 *IMPRONTA SOCIAL* 』━━━━━━━┓
┃ ✈️ *TELEGRAM:* [Verifica Account](https://t.me/+${snumber})
┃ 👥 *FACEBOOK:* [Cerca Numero](https://www.facebook.com/search/top/?q=%2B${snumber})
┃ 📸 *INSTAGRAM:* [Lookup User](https://www.instagram.com/explore/tags/${snumber})
┃ 🐦 *TWITTER/X:* [Cerca Post](https://twitter.com/search?q=%2B${snumber})
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━『 *TRUECALLER POVERI* 』━━━━━━━┓
┃ 📞 *CHI CHIAMA:* [Database Italia](https://www.chichiama.it/numero/${snumber}.html)
┃ 🔎 *TELLOWS:* [Segnalazioni Spam](https://www.tellows.it/num/${snumber})
┃ 🕵️‍♂️ *TRUECALLER:* [Identifica Nome](https://www.truecaller.com/search/it/${snumber})
┃ 🕵️‍♂️ *GOOGLE:* [Deep Search](https://www.google.com/search?q=%22${snumber}%22)
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

> *[LOG]: Scansione completata. Clicca sui link blu per approfondire l'indagine.*
`.trim()

    await conn.sendFile(m.chat, pp, 'osint.jpg', report, m, false, { mentions: [who] })
    await conn.sendMessage(m.chat, { delete: key })

  } catch (e) {
    console.error(e)
    await edit('❌ `[ERROR]`: Errore critico nel modulo Social-Scan.')
  }
}

handler.help = ['osint @tag']
handler.tags = ['tools']
handler.command = /^(osint|lookup|truecaller)$/i

export default handler
