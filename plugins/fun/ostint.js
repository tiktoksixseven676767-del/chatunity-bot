import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // 1. Controllo se l'utente ha inserito il numero
  if (!text) {
    return conn.reply(m.chat, `『 🔍 』 *Inserisci un numero di telefono*\n\n*✧ Esempio:* \n${usedPrefix}${command} 13022612667`, m)
  }

  // Pulizia del numero (rimuove spazi, + o trattini se presenti)
  let phoneNumber = text.replace(/[^0-9]/g, '')

  await conn.sendMessage(m.chat, { react: { text: "🔎", key: m.key } })

  // --- CONFIGURAZIONE RAPIDAPI ---
  const RAPIDAPI_KEY = 'IL_TUO_TOKEN_QUI' // <--- Incolla qui la tua Key di RapidAPI
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
    
    // Se l'API non risponde correttamente (es. 401 Unauthorized o 429 Too Many Requests)
    if (!res.ok) {
        throw new Error(`Errore API: ${res.status} ${res.statusText}`)
    }

    let json = await res.json()

    // Controllo se abbiamo dati validi
    if (!json || Object.keys(json).length === 0) {
      return conn.reply(m.chat, '❌ Nessuna informazione trovata per questo numero.', m)
    }

    // Costruzione del messaggio di risposta (Adatta i campi in base alla risposta reale dell'API)
    let caption = `『 🔍 *RISULTATI OSINT* 🔍 』\n\n`
    caption += `*• Numero:* ${phoneNumber}\n`
    
    // Esempio di mappatura dati (modifica in base a cosa restituisce l'API bizos)
    if (json.name) caption += `*• Nome:* ${json.name}\n`
    if (json.biz_description) caption += `*• Bio:* ${json.biz_description}\n`
    if (json.address) caption += `*• Indirizzo:* ${json.address}\n`
    if (json.email) caption += `*• Email:* ${json.email}\n`
    if (json.website) caption += `*• Sito:* ${json.website}\n`
    
    // Se l'API restituisce un'immagine del profilo
    if (json.profile_pic) {
        await conn.sendFile(m.chat, json.profile_pic, 'osint.jpg', caption, m)
    } else {
        await conn.reply(m.chat, caption, m)
    }

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

  } catch (err) {
    console.error('Errore OSINT:', err)
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
    await conn.reply(m.chat, `❌ Errore durante la ricerca.\n\n*Dettaglio:* ${err.message}`, m)
  }
}

handler.help = ['osint *<numero>*']
handler.tags = ['tools']
handler.command = /^(osint|bizos|lookup)$/i

export default handler
