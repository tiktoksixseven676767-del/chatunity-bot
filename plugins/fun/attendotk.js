import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    await conn.reply(m.chat, `『 🎵 』 *Inserisci un link di TikTok*\n\n*✧ Esempio:* \n${usedPrefix}${command} https://vm.tiktok.com/ZNRCyaEjT/`, m)
    return
  }

  await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

  try {
    // TENTATIVO 1: API di Ame-Api (Molto veloce)
    let res = await fetch(`https://api.agatz.xyz/api/tiktok?url=${encodeURIComponent(text)}`)
    let json = await res.json()

    let audioUrl
    let title
    let cover

    if (json.status === 200) {
      audioUrl = json.data.music
      title = json.data.title
      cover = json.data.cover
    } else {
      // TENTATIVO 2 (Fallback): Se la prima fallisce, proviamo un'altra
      let res2 = await fetch(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(text)}`)
      let json2 = await res2.json()
      
      if (!json2 || !json2.music) throw 'Entrambe le API sono offline'
      
      audioUrl = json2.music.play_url
      title = json2.title
      cover = json2.video.cover
    }

    const doc = {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      fileName: `audio.mp3`,
      ptt: false,
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          mediaType: 1,
          title: title || 'TikTok Audio',
          body: 'Scaricato con Successo',
          thumbnailUrl: cover,
          sourceUrl: text
        }
      }
    }

    await conn.sendMessage(m.chat, doc, { quoted: m })
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

  } catch (err) {
    console.error('Errore TikTok:', err)
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
    await conn.reply(m.chat, '❌ Errore: Tutte le API di download sono attualmente sature o il link è privato/non valido.', m)
  }
}

handler.help = ['ttaudio *<url>*']
handler.tags = ['download']
handler.command = /^(tiktokmp3|ttmp3|ttaudio)$/i

export default handler
