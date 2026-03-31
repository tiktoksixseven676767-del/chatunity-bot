import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // 1. Controllo input
  if (!text) {
    await conn.reply(m.chat, `『 🎵 』 *Inserisci un link di TikTok*\n\n*✧ Esempio:* \n${usedPrefix}${command} https://www.tiktok.com/@user/video/123456789`, m)
    return
  }

  // 2. Reazione di attesa
  await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

  try {
    // Utilizzo di Tiklydown API (Public & Free)
    // Questa API restituisce un JSON con i dettagli del video e dell'audio
    let res = await fetch(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(text)}`)
    let json = await res.json()

    // 3. Controllo se l'audio esiste nella risposta
    if (!json || !json.music || !json.music.play_url) {
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
      return conn.reply(m.chat, '❌ Impossibile trovare l\'audio. Assicurati che il link sia corretto e il video pubblico.', m)
    }

    const audioUrl = json.music.play_url
    const title = json.title || 'TikTok Audio'

    // 4. Invio dell'audio
    const doc = {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg', // MP3 standard
      fileName: `${title}.mp3`,
      ptt: false, // Imposta a true se vuoi che venga inviato come nota vocale
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          mediaType: 1,
          title: title,
          body: 'TikTok Audio Downloader',
          thumbnailUrl: json.video.cover, 
          sourceUrl: text
        }
      }
    }

    await conn.sendMessage(m.chat, doc, { quoted: m })
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

  } catch (err) {
    console.error('Errore ttaudio:', err)
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
    await conn.reply(m.chat, '❌ Si è verificato un errore durante l\'elaborazione. L\'API potrebbe essere momentaneamente offline.', m)
  }
}

handler.help = ['ttaudio *<url>*']
handler.tags = ['download']
handler.command = /^(tiktokmp3|ttmp3|ttaudio)$/i

export default handler
