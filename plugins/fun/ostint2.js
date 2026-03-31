import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.sender
  let snumber = who.split('@')[0]
  
  // Messaggio di caricamento iniziale
  let { key } = await conn.sendMessage(m.chat, { text: '`[SYSTEM]: Inizializzazione protocollo OSINT...`' }, { quoted: m })
  
  // Funzione interna per editare il messaggio senza errori
  const edit = async (txt) => await conn.sendMessage(m.chat, { text: txt, edit: key })

  await new Promise(res => setTimeout(res, 800))
  await edit('`[SYSTEM]: Violazione database in corso: [||||      ] 40%`')
  await new Promise(res => setTimeout(res, 800))
  await edit('`[SYSTEM]: Estrazione pacchetti completata: [||||||||||] 100%`')

  try {
    // Recupero dati WA
    let bio = await conn.fetchStatus(who).catch(_ => 'Riservata/Privata')
    let pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png')
    let user = global.db.data.users[who] || {}
    
    // Analisi Prefisso e Nazione
    let prefix = snumber.slice(0, 2)
    let res = await fetch(`https://restcountries.com/v3.1/callingcode/${prefix}`)
    let countryData = await res.json()
    let c = countryData[0] || {}

    let report = `
✨ *REPORT INVESTIGATIVO OSINT* ✨
  
┏━━━━━━━『 *IDENTITÀ* 』━━━━━━━┓
┃ 🆔 *ID:* ${who.replace('@s.whatsapp.net', '')}
┃ 👤 *USER:* @${snumber}
┃ 📝 *STATUS:* ${bio.status || bio}
┃ 📅 *BIO_SET:* ${bio.setAt || 'Non rilevato'}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━『 *LOCALIZZAZIONE* 』━━━━━━━┓
┃ 🗺️ *REGIONE:* ${c.subregion || 'Sconosciuta'}
┃ 🚩 *NAZIONE:* ${c.name?.common || 'N/A'} ${c.flag || ''}
┃ 🏙️ *CAPITALE:* ${c.capital ? c.capital[0] : 'N/A'}
┃ 🕒 *TIMEZONE:* ${c.timezones ? c.timezones[0] : 'UTC'}
┃ 💰 *VALUTA:* ${c.currencies ? Object.keys(c.currencies)[0] : 'N/A'}
┃ 📍 *COORDINATE:* ${c.latlng ? c.latlng.join(', ') : 'N/A'}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━『 *TECNICO* 』━━━━━━━┓
┃ 📡 *CARRIER:* +${prefix} (Global Network)
┃ 📶 *SISTEMA:* WhatsApp Multi-Device
┃ 🔗 *WA_LINK:* wa.me/${snumber}
┃ 🗺️ *MAPS:* https://www.google.com/maps?q=${c.latlng ? c.latlng.join(',') : '0,0'}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━『 *DATABASE BOT* 』━━━━━━━┓
┃ 🪙 *MONETE:* ${user.limit || 0}
┃ 🏆 *LIVELLO:* ${user.level || 0}
┃ 🎭 *RUOLO:* ${user.role || 'Utente'}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

> *[LOG]: Scansione terminata con successo.*
`.trim()

    await conn.sendFile(m.chat, pp, 'osint.jpg', report, m, false, { mentions: [who] })
    await conn.sendMessage(m.chat, { react: { text: "💉", key: m.key } })
    
    // Elimina il messaggio di caricamento
    await conn.sendMessage(m.chat, { delete: key })

  } catch (e) {
    console.error(e)
    await edit('❌ `[FATAL_ERROR]`: Il firewall ha bloccato l\'estrazione dei dati.')
  }
}

handler.help = ['osint @tag']
handler.tags = ['tools']
handler.command = /^(osint|lookup|info)$/i

export default handler
