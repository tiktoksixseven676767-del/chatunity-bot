import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.sender
  let snumber = who.split('@')[0]
  
  // Effetto caricamento nei messaggi
  let { key } = await conn.sendMessage(m.chat, { text: '`[SYSTEM]: Inizializzazione protocollo OSINT...`' }, { quoted: m })
  await new Promise(res => setTimeout(res, 1000))
  await conn.editMessage(key, '`[SYSTEM]: Violazione database in corso: [||||      ] 40%`')
  await new Promise(res => setTimeout(res, 1000))
  await conn.editMessage(key, '`[SYSTEM]: Estrazione pacchetti completata: [||||||||||] 100%`')

  try {
    // Recupero dati WA
    let bio = await conn.fetchStatus(who).catch(_ => 'Privata/Non disponibile')
    let pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png')
    let user = global.db.data.users[who]
    
    // Analisi Prefisso e Nazione
    let prefix = snumber.slice(0, 2)
    let res = await fetch(`https://restcountries.com/v3.1/callingcode/${prefix}`)
    let countryData = await res.json()
    let c = countryData[0] || {}

    let report = `
✨ *REPORT INVESTIGATIVO v2.0* ✨
  
╔═════════『 *IDENTITÀ* 』═════════╗
┃ 🆔 *ID:* ${who.replace('@s.whatsapp.net', '')}
┃ 👤 *USER:* @${snumber}
┃ 📝 *STATUS:* ${bio.status || bio}
┃ 📅 *SET BIO:* ${bio.setAt || 'N/A'}
╚══════════════════════════════╝

╔═════════『 *GEOLOCAL* 』═════════╗
┃ 🗺️ *REGION:* ${c.subregion || 'Sconosciuta'}
┃ 🚩 *COUNTRY:* ${c.name?.common || 'N/A'} ${c.flag || ''}
┃ 🏙️ *CAPITALE:* ${c.capital ? c.capital[0] : 'N/A'}
┃ 🕒 *TIMEZONE:* ${c.timezones ? c.timezones[0] : 'UTC'}
┃ 💰 *VALUTA:* ${c.currencies ? Object.keys(c.currencies)[0] : 'N/A'}
╚══════════════════════════════╝

╔═════════『 *NETWORK* 』═════════╗
┃ 📡 *PROVIDER:* Analisi Carrier...
┃ 📶 *SIGNAL:* Verificato (WhatsApp MD)
┃ 🔌 *PREFIX:* +${prefix} (International)
┃ 🔗 *WA.ME:* https://wa.me/${snumber}
╚══════════════════════════════╝

╔═════════『 *BOT DATA* 』═════════╗
┃ 🪙 *MONETE:* ${user?.limit || 0}
┃ 🏆 *LIVELLO:* ${user?.level || 0}
┃ 🎭 *RUOLO:* ${user?.role || 'User'}
╚══════════════════════════════╝

> *Protocollo eseguito con successo.*
`.trim()

    await conn.sendFile(m.chat, pp, 'error.jpg', report, m, false, { mentions: [who] })
    await conn.sendMessage(m.chat, { react: { text: "💉", key: m.key } })
    
    // Cancella il messaggio di caricamento dopo aver inviato il report
    await conn.sendMessage(m.chat, { delete: key })

  } catch (e) {
    console.error(e)
    conn.editMessage(key, '❌ `[FATAL_ERROR]`: Accesso negato dal firewall di WhatsApp.')
  }
}

handler.help = ['osint @tag']
handler.tags = ['tools']
handler.command = /^(osint|lookup|info)$/i

export default handler
