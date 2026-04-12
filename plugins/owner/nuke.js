import { promises as fs } from 'fs'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

var handler = async (m, { conn, participants }) => {
  try {
    // 1. Identifica i protetti (Owner e Bot stesso)
    const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net'
    const userSender = m.sender
    
    // Lista JID da non rimuovere
    const protectedJids = [botJid, userSender]

    // Funzione per dividere gli utenti in gruppi (evita crash di WhatsApp)
    const chunk = (arr, size) => {
      const out = []
      for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
      return out
    }

    // 2. Modifica Info Gruppo
    const canale = 'https://whatsapp.com/channel/0029Vb8qv97J3juwDKlY9L31'
    
    await conn.groupUpdateSubject(m.chat, `SVT BY MAZZU`).catch(() => {})
    await delay(1000)
    
    await conn.groupUpdateDescription(m.chat, `D'ora in poi... io starò in cima.\n\n${canale}`).catch(() => {})
    await delay(1000)

    // 3. INVIO IMMAGINE (Pulito, senza global.fake)
    const imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpnbN2TlEXKGJEke-QKag5QoV-0b0Xb6FgdpZ-7oDpfQ&s=10'
    
    await conn.sendMessage(m.chat, {
        image: { url: imageUrl },
        caption: `\`Sparisce tutto.\` \n\nCanale: ${canale}`
    })

    await delay(2000)

    // 4. Rimozione Membri (Escludendo i protetti)
    const allParticipants = participants.map(p => p.id)
    const toRemove = allParticipants.filter(jid => !protectedJids.includes(jid))

    if (toRemove.length > 0) {
      // Rimuoviamo 5 persone alla volta per sicurezza
      for (const group of chunk(toRemove, 5)) {
        await conn.groupParticipantsUpdate(m.chat, group, 'remove').catch(e => console.error('Errore rimozione:', e))
        await delay(1500)
      }
    }

  } catch (e) {
    console.error("ERRORE CRITICO:", e)
  }
}

handler.command = /^nuke-by-mazzu$/i
handler.group = true
handler.owner = true
handler.botAdmin = true

export default handler
