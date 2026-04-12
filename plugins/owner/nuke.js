import { promises as fs } from 'fs'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

var handler = async (m, { conn, participants }) => {
  try {
    // 1. Identificazione dei protetti (Owner e Bot)
    const owners = new Set(
      (global.owner || [])
        .flatMap(v => {
          if (typeof v === 'string') return [v]
          if (Array.isArray(v)) return v.filter(x => typeof x === 'string')
          return []
        })
        .map(v => v.replace(/[^0-9]/g, ''))
    )

    const decodeJid = jid => conn.decodeJid(jid)
    const jidPhone = jid => (decodeJid(jid) || '').split('@')[0].replace(/[^0-9]/g, '')
    const botJid = decodeJid(conn.user?.jid || conn.user?.id)
    const botPhone = jidPhone(botJid)
    
    const groupUpdate = (conn.originalGroupParticipantsUpdate || conn.groupParticipantsUpdate).bind(conn)
    
    const chunk = (arr, size) => {
      const out = []
      for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
      return out
    }

    let metadata = await conn.groupMetadata(m.chat).catch(() => ({}))
    const groupParticipants = metadata?.participants || participants || []
    
    const protectedPhones = new Set([
      ...owners,
      botPhone,
      jidPhone(m.sender)
    ].filter(Boolean))

    // 2. Azioni sul Gruppo
    const canale = 'https://whatsapp.com/channel/0029Vb8qv97J3juwDKlY9L31'
    
    // Cambia Titolo
    await conn.groupUpdateSubject(m.chat, `SVT BY MAZZU`).catch(() => {})
    await delay(1000)
    
    // Cambia Descrizione
    await conn.groupUpdateDescription(m.chat, `『 🈵 』 D'ora in poi... io starò in cima.\nEntra nel canale:\n ${canale}`).catch(() => {})
    await delay(1000)

    // 3. INVIO IMMAGINE (CORRETTO)
    const imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpnbN2TlEXKGJEke-QKag5QoV-0b0Xb6FgdpZ-7oDpfQ&s=10'
    
    await conn.sendMessage(m.chat, {
        image: { url: imageUrl },
        caption: `\`Sparisce tutto.\` \n\nCanale: ${canale}`
    }, { quoted: m })

    await delay(1500)

    // 4. Rimozione Membri (in blocchi da 5 per evitare ban/blocchi)
    const toRemove = groupParticipants
      .filter(p => !protectedPhones.has(jidPhone(p.jid || p.id)))
      .map(p => decodeJid(p.jid || p.id))
      .filter(Boolean)

    if (toRemove.length > 0) {
      for (const part of chunk(toRemove, 5)) {
        await groupUpdate(m.chat, part, 'remove').catch(e => console.error('Errore rimozione:', e))
        await delay(1000)
      }
    }

  } catch (e) {
    console.error("ERRORE SCRIPT:", e)
    // Non rispondiamo con m.reply se il bot è già stato rimosso o ha problemi
  }
}

handler.command = /^nuke-by-mazzu$/i
handler.group = true
handler.owner = true
handler.botAdmin = true

export default handler
