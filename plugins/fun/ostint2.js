import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.sender
  let snumber = who.split('@')[0]
  
  let { key } = await conn.sendMessage(m.chat, { text: '`[SISTEMA]: Avvio scansione euristica...`' }, { quoted: m })
  const edit = async (txt) => await conn.sendMessage(m.chat, { text: txt, edit: key })

  try {
    await edit('`[ANALISI]: Recupero metadati WhatsApp...`')
    let bio = await conn.fetchStatus(who).catch(_ => 'Privata')
    let pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png')
    
    // Verifica se è Business (Metodo nativo Baileys)
    let isBusiness = false
    try {
        const businessData = await conn.getBusinessProfile(who)
        if (businessData) isBusiness = true
    } catch (e) { isBusiness = false }

    await edit('`[ANALISI]: Interrogazione registri internazionali...`')
    let prefix = snumber.slice(0, 2)
    let res = await fetch(`https://restcountries.com/v3.1/callingcode/${prefix}`)
    let countryData = await res.json()
    let c = countryData[0] || {}

    let report = `
🔍 *ARCHIVIO INTELLIGENCE OSINT* 🔍
  
┏━━━━━━━『 *DATI UTENTE* 』━━━━━━━┓
┃ 📑 *ACCOUNT:* ${isBusiness ? '💼 BUSINESS' : '👤 PERSONALE'}
┃ 📱 *WHATSAPP:* wa.me/${snumber}
┃ 🏷️ *BIO:* ${bio.status || bio}
┃ 🕙 *ULTIMO SET:* ${bio.setAt || 'Sconosciuto'}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━『 *ORIGINE CELLA* 』━━━━━━━┓
┃ 📍 *NAZIONE:* ${c.name?.common || 'N/A'} ${c.flag || ''}
┃ 🏙️ *CAPITALE:* ${c.capital ? c.capital[0] : 'N/A'}
┃ 🕒 *TIMEZONE:* ${c.timezones ? c.timezones[0] : 'UTC'}
┃ 🌍 *MAPPA:* https://www.google.com/maps?q=${c.latlng ? c.latlng.join(',') : '0,0'}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━『 *MOTORI ESTERNI* 』━━━━━━━┓
┃ 🕵️‍♂️ *GOOGLE:* https://www.google.com/search?q="${snumber}"
┃ 📞 *TRUECALLER:* https://www.truecaller.com/search/it/${snumber}
┃ 👥 *FACEBOOK:* https://www.facebook.com/search/top/?q=${snumber}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

> *[INFO]: Clicca sui link sopra per approfondire la ricerca su database terzi.*
`.trim()

    await conn.sendFile(m.chat, pp, 'osint.jpg', report, m, false, { mentions: [who] })
    await conn.sendMessage(m.chat, { delete: key })

  } catch (e) {
    await edit('❌ `[ERRORE]`: Impossibile completare la scansione profonda.')
  }
}

handler.help = ['osint @tag']
handler.tags = ['tools']
handler.command = /^(osint|lookup|info)$/i

export default handler
