import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // 1. Controllo se l'utente ha inserito il numero
  if (!text) {
    return conn.reply(m.chat, `『 🔍 』 *Inserisci un numero di telefono*\n\n*✧ Esempio:* \n${usedPrefix}${command} 13022612667`, m)
  }

  // Pulizia del numero: tiene solo le cifre
  let phoneNumber = text.replace(/[^0-9]/g, '')

  // Reazione di attesa
  await conn.sendMessage(m.chat, { react: { text: "🔎", key: m.key } })

  // --- CONFIGURAZIONE RAPIDAPI ---
  const url = 'https://whatsapp-osint.p.rapidapi.com/bizos'
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-key': '7884fe67efmsh008f5ea643b15a7p16158ajsn0c8122ad91fd',
      'x-rapidapi-host': 'whatsapp-osint.p.rapidapi.com'
    },
    body: JSON.stringify({ phone: phoneNumber })
  }

  try {
    let res = await fetch(url, options)
    
    if (!res.ok) {
      throw new Error(`Status: ${res.status}`)
    }

    let json = await res.json()

    // Se l'API non restituisce nulla o il profilo non è Business/Pubblico
    if (!json || Object.keys(json).length === 0) {
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
      return conn.reply(m.chat, '❌ Nessuna informazione trovata. Il numero potrebbe non essere un account Business o ha la privacy elevata.', m)
    }

    // Costruzione del messaggio con i dati ricevuti
    let caption = `『 🔍 *WHATSAPP OSINT* 🔍 』\n\n`
    caption += `*• Numero:* ${phoneNumber}\n`
    if (json.name) caption += `*• Nome:* ${json.name}\n`
    if (json.biz_description) caption += `*• Bio:* ${json.biz_description}\n`
    if (json.category) caption += `*• Categoria:* ${json.category}\n`
    if (json.address) caption += `*• Indirizzo:* ${json.address}\n`
    if (json.email) caption += `*• Email:* ${json.email}\n`
    if (json.website && json.website.length > 0) {
      caption += `*• Sito:* ${json.website[0]}\n`
    }

    // Se l'API restituisce una foto profilo, invia quella con la didascalia
    let image = json.profile_pic || json.image
    
    if (image) {
      await conn.sendFile(m.chat, image, 'osint.jpg', caption, m)
    } else {
      await conn.reply(m.chat, caption, m)
    }

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

  } catch (err) {
    console.error('Errore OSINT:', err)
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
    await conn.reply(m.chat, `❌ Errore durante la ricerca. Verifica che l'API Key sia ancora valida.`, m)
  }
}

handler.help = ['osint *<numero>*']
handler.tags = ['tools']
handler.command = /^(osint|bizos)$/i

export default handler
