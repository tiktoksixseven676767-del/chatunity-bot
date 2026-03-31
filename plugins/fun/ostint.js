import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // 1. Verifica se l'utente ha fornito un numero
  if (!text) {
    return conn.reply(m.chat, `『 🔍 』 *Inserisci un numero di telefono*\n\n*✧ Esempio:* \n${usedPrefix}${command} 13022612667`, m)
  }

  // Pulizia del numero: tiene solo le cifre (rimuove +, spazi, ecc.)
  let phoneNumber = text.replace(/[^0-9]/g, '')

  // Feedback visivo di caricamento
  await conn.sendMessage(m.chat, { react: { text: "🔎", key: m.key } })

  // --- CONFIGURAZIONE RAPIDAPI ---
  // Sostituisci 'LA_TUA_CHIAVE_RAPIDAPI' con la tua Key personale
  const RAPIDAPI_KEY = 'LA_TUA_CHIAVE_RAPIDAPI' 
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
    
    if (!res.ok) {
        throw new Error(`Errore API: ${res.status} - Assicurati che la Key sia corretta.`)
    }

    let json = await res.json()

    // Controllo se l'API ha restituito dati
    if (!json || Object.keys(json).length === 0) {
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
      return conn.reply(m.chat, '❌ Nessuna informazione trovata per questo numero o profilo non pubblico.', m)
    }

    // Costruzione del messaggio di risposta
    let caption = `『 🔍 *RISULTATI WHATSAPP OSINT* 🔍 』\n\n`
    caption += `*• Numero:* ${phoneNumber}\n`
    
    // Mappatura dei campi (l'API bizos restituisce dettagli sui profili business/pubblici)
    if (json.name) caption += `*• Nome:* ${json.name}\n`
    if (json.biz_description) caption += `*• Bio:* ${json.biz_description}\n`
    if (json.category) caption += `*• Categoria:* ${json.category}\n`
    if (json.address) caption += `*• Indirizzo:* ${json.address}\n`
    if (json.email) caption += `*• Email:* ${json.email}\n`
    if (json.website && json.website.length > 0) {
        caption += `*• Sito Web:* ${json.website[0]}\n`
    }
    
    // Se l'API restituisce un'immagine del profilo (profile_pic o image)
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
    await conn.reply(m.chat, `❌ Errore durante la ricerca.\n\n*Dettaglio:* ${err.message}`, m)
  }
}

handler.help = ['osint *<numero>*']
handler.tags = ['tools']
handler.command = /^(osint|bizos|lookup)$/i

export default handler
