import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    await conn.reply(m.chat, `『 🎵 』 *Inserisci un link di TikTok*\n\n*✧ Esempio:* \n${usedPrefix}${command} https://vm.tiktok.com/ZNRCyaEjT/`, m)
    return
  }

  // Reazione di attesa
  await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

  try {
    // COSTRUZIONE AUTOMATICA DEL LINK API + LINK UTENTE
    // Usiamo l'endpoint di Botcahx che è molto affidabile per i link vm.tiktok
    let api_url = `https://api.botcahx.eu.org/api/dowloader/tikok?url=${encodeURIComponent(text)}&apikey=btcz87`
    
    let res = await fetch(api_url)
    let json = await res.json()

    // Controllo se l'API ha risposto correttamente (status: true o 200)
    if (!json.status) {
      // Secondo tentativo con API alternativa se la prima fallisce
      let res2 = await fetch(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(text)}`)
      json = await res2.json()
    }

    // Estrazione dati (gestisce diversi formati di risposta)
    let audioUrl = json.result?.music?.play_url || json.music?.play_url || json.result?.audio
    let title = json.result?.title || json.title || 'TikTok Audio'
    let cover = json.result?.video?.cover || json.video?.cover || json.result?.cover

    if (!audioUrl) throw 'Audio non trovato'

    const doc = {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      fileName: `audio.mp3`,
      ptt: false,
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          mediaType: 1,
          title: title,
          body: 'TikTok MP3 Downloader',
          thumbnailUrl: cover,
          sourceUrl: text
        }
      }
    }

    await conn.sendMessage(m.chat, doc, { quoted: m })
    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

  } catch (err) {
    console.error('Errore:', err)
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
    await conn.reply(m.chat, '❌ Errore nell\'estrazione dell\'audio. Riprova con un altro link.', m)
  }
}

handler.help = ['ttaudio *<url>*']
handler.tags = ['download']
handler.command = /^(tiktokmp3|ttmp3|ttaudio)$/i

export default handler
