import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let who
  
  // 1. Identifica chi analizzare: se c'è un tag, se è una risposta a un messaggio, o se è un numero scritto
  if (m.mentionedJid[0]) {
    who = m.mentionedJid[0]
  } else if (m.quoted) {
    who = m.quoted.sender
  } else if (text) {
    who = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
  } else {
    return conn.reply(m.chat, `『 🔍 』 *Tagga qualcuno o rispondi a un messaggio*\n\n*✧ Esempio:* \n${usedPrefix}${command} @utente`, m)
  }

  // Estrae solo i numeri dal JID (es. 393331234567@s.whatsapp.net -> 393331234567)
  let phoneNumber = who.split('@')[0]

  await conn.sendMessage(m.chat, { react: { text: "🔎", key: m.key } })

  // --- CONFIGURAZIONE RAPIDAPI ---
  const RAPIDAPI_KEY = '7884fe67efmsh008f5ea643b15a7p16158ajsn0c8122ad91fd'
  const url = 'https://whatsapp-osint.p.rapidapi.com/bizos'
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': 'whatsapp-osint.p.rapidapi.com'
    },
    body: JSON.stringify({ phone: phoneNumber })
  }

  try {
    let res = await fetch(url, options)
    let json = await res.json()

    if (!json || Object.keys(json).length === 0 || json.message === "Forbidden") {
      await conn.sendMessage(m.chat, { react: { text: "⚠️", key: m.key } })
      return conn.reply(m.chat, `❌ *Nessun dato pubblico trovato.*\n\nL'account potrebbe essere privato o non Business. Assicurati anche di aver attivato il piano "Free" su RapidAPI.`, m)
    }

    let caption = `『 🔍 *DETTAGLI OSINT* 🔍 』\n\n`
    caption += `*• Tag:* @${phoneNumber}\n`
    caption += `*• Numero:* ${phoneNumber}\n`
    if (json.name) caption += `*• Nome:* ${json.name}\n`
    if (json.biz_description) caption += `*• Bio:* ${json.biz_description}\n`
    if (json.category) caption += `*• Categoria:* ${json.category}\n`
    if (json.address) caption += `*• Indirizzo:* ${json.address}\n`
    if (json.email) caption += `*• Email:* ${json.email}\n`
    
    let image = json.profile_pic || json.image

    if (image) {
      await conn.sendFile(m.chat, image, 'osint.jpg', caption, m, false, { mentions: [who] })
    } else {
      await conn.reply(m.chat, caption, m, { mentions: [who] })
    }

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

  } catch (err) {
    console.error(err)
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
    await conn.reply(m.chat, `❌ Errore durante il recupero dei dati.`, m)
  }
}

handler.help = ['osint @tag']
handler.tags = ['tools']
handler.command = /^(osint|lookup|info)$/i

export default handler
