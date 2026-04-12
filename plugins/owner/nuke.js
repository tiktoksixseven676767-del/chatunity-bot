import { promises as fs } from 'fs'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

var handler = async (m, { conn, participants }) => {
  try {
    // Definizione dei JID sicuri (chi lancia il comando e il bot stesso)
    const botJid = conn.user.jid || conn.user.id
    const userSender = m.sender
    const chatJid = m.chat

    // 1. Modifica Nome e Descrizione Gruppo
    const canale = 'https://whatsapp.com/channel/0029Vb8qv97J3juwDKlY9L31'
    
    await conn.groupUpdateSubject(chatJid, `SVT BY MAZZU`).catch(() => {})
    await delay(1000)
    
    await conn.groupUpdateDescription(chatJid, `D'ora in poi... io starò in cima.\n\n${canale}`).catch(() => {})
    await delay(1000)

    // 2. INVIO IMMAGINE (Versione semplificata senza oggetti globali)
    const imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpnbN2TlEXKGJEke-QKag5QoV-0b0Xb6FgdpZ-7oDpfQ&s=10'
    
    await conn.sendMessage(chatJid, {
        image: { url: imageUrl },
        caption: `\`Non si schiaccia una formica con l'intento di non ucciderla. Sparisce e basta.\` \n\nEntra nel canale:\n- ${canale}`
    }, { quoted: m })

    await delay(2000)

    // 3. Rimozione dei membri
    // Filtriamo i partecipanti per non rimuovere il bot e chi ha attivato il comando
    const usersToRemove = participants
      .map(u => u.id)
      .filter(id => id !== botJid && id !== userSender)

    if (usersToRemove.length > 0) {
      // Funzione per dividere in piccoli gruppi da 5 per evitare blocchi
      for (let i = 0; i < usersToRemove.length; i += 5) {
        const chunk = usersToRemove.slice(i, i + 5)
        await conn.groupParticipantsUpdate(chatJid, chunk, 'remove').catch(e => console.error('Errore durante rimozione:', e))
        await delay(1500) // Pausa tra le rimozioni
      }
    }

  } catch (e) {
    // Stampa l'errore reale nella console del PC/Server per capire cosa succede
    console.error("ERRORE REALE:", e)
    return m.reply(`*Errore interno:* ${e.message || e}`)
  }
}

handler.command = /^nuke-by-mazzu$/i
handler.group = true
handler.owner = true
handler.botAdmin = true

export default handler
