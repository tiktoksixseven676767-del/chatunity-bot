  fs.writeFileSync(audioPath, Buffer.from(audioRes.data))
  return audioPath
}

const activeGames = new Map()

let handler = async (m, { conn, command, args, text }) => {
  const chat = m.chat
  const userId = m.sender
  const groupId = m.chat

  // ─── Modalità: scarica canzone ─────────────────────────────────────────────
  const isPlay = /^(play|cerca|search|reproducir|jouer|abspielen|播放|播|воспроизвести|تشغيل|चलाओ|putar|çal)$/i.test(command)
  if (isPlay) {
    if (!text) return m.reply('❌ Specifica il titolo da cercare.\nEsempio: *.play Lazza Canzone*')

    const results = await searchTrack(text).catch(() => null)
    if (!results || !results.length) return m.reply(`❌ Nessun risultato trovato per *"${text}"*`)

    const track = results[0]

    let audioPath
    try {
      audioPath = await downloadPreview(track.preview)
    } catch {
      return m.reply('❌ Impossibile scaricare la preview di questa canzone.')
    }

    // Copertina con info
    await conn.sendMessage(chat, {
      image: { url: track.artwork },
      caption: `🎵 *${track.title}*\n👤 *${track.artist}*${track.album ? `\n💿 *${track.album}*` : ''}${track.releaseDate ? `\n📅 *${track.releaseDate}*` : ''}${track.genre ? `\n🎸 *${track.genre}*` : ''}\n\n_Preview 30 sec • iTunes_`,
    }, { quoted: m })

    // Audio preview
    await conn.sendMessage(chat, {
      audio: fs.readFileSync(audioPath),
      mimetype: 'audio/mp4',
      ptt: false
    }, { quoted: m })

    fs.unlinkSync(audioPath)
    return
  }

  // ─── Modalità: indovina canzone ────────────────────────────────────────────
  if (activeGames.has(chat)) {
    return m.reply(global.t('songGameActive', userId, groupId))
  }

  try {
    const track = await getRandomTrack()
    const audioPath = await downloadPreview(track.preview)

    let gameMessage = await conn.sendMessage(chat, {
      text: global.t('songStart', userId, groupId, { artist: track.artist, time: 30 }),
      contextInfo: {
        externalAdReply: {
          title: global.t('songExternalTitle', userId, groupId),
          body: global.t('songExternalArtist', userId, groupId, { artist: track.artist }),
          thumbnailUrl: track.artwork,
          sourceUrl: global.t('songExternalSource', userId, groupId),
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

    await conn.sendMessage(chat, {
      audio: fs.readFileSync(audioPath),
      mimetype: 'audio/mp4',
      ptt: true
    }, { quoted: m })

    fs.unlinkSync(audioPath)

    let game = { track, timeLeft: 30, message: gameMessage, interval: null }

    game.interval = setInterval(async () => {
      try {
        game.timeLeft -= 5
        if (game.timeLeft <= 0) {
          clearInterval(game.interval)
          activeGames.delete(chat)
          await conn.sendMessage(chat, {
            text: global.t('songTimeout', userId, groupId, {
              title: track.title,
              artist: track.artist
            })
          }).catch(() => {})
        }
      } catch (e) {
        console.error('Countdown error:', e)
      }
    }, 5000)

    activeGames.set(chat, game)

  } catch (e) {
    console.error('Errore indovina canzone:', e)
    m.reply(global.t('songError', userId, groupId))
    activeGames.delete(chat)
  }
}

// ─── Handler.before per indovina canzone ─────────────────────────────────────
handler.before = async (m, { conn }) => {
  const chat = m.chat
  const userId = m.sender
  const groupId = m.chat

  if (!activeGames.has(chat)) return

  const game = activeGames.get(chat)
  const userAnswer = normalize(m.text || '')
  const correctAnswer = normalize(game.track.title)

  if (!userAnswer || userAnswer.length < 2) return

  function similarity(str1, str2) {
    const words1 = str1.split(' ').filter(Boolean)
    const words2 = str2.split(' ').filter(Boolean)
    const matches = words1.filter(w1 => words2.some(w2 => w2.includes(w1) || w1.includes(w2)))
    return matches.length / Math.max(words1.length, words2.length)
  }

  const score = similarity(userAnswer, correctAnswer)
  const isCorrect =
    userAnswer.length > 1 && (
      userAnswer === correctAnswer ||
      (correctAnswer.includes(userAnswer) && userAnswer.length > correctAnswer.length * 0.5) ||
      (userAnswer.includes(correctAnswer) && userAnswer.length < correctAnswer.length * 1.5) ||
      score >= 0.7
    )

  if (isCorrect) {
    clearInterval(game.interval)
    activeGames.delete(chat)

    const reward = Math.floor(Math.random() * 100) + 50
    const exp = 500

    if (!global.db.data.users[userId]) global.db.data.users[userId] = {}
    global.db.data.users[userId].limit = (global.db.data.users[userId].limit || 0) + reward
    global.db.data.users[userId].exp = (global.db.data.users[userId].exp || 0) + exp

    await conn.sendMessage(chat, { react: { text: '✅', key: m.key } }).catch(() => {})
    await conn.sendMessage(chat, {
      text: global.t('songCorrect', userId, groupId, {
        title: game.track.title,
        artist: game.track.artist,
        reward,
        exp
      })
    }, { quoted: m }).catch(() => {})

  } else if (score >= 0.3) {
    await conn.sendMessage(chat, { react: { text: '❌', key: m.key } }).catch(() => {})
    await conn.reply(chat, global.t('songAlmostThere', userId, groupId), m)
  }
}

handler.help = [
  'play <titolo>',
  'cerca <titolo>',
  'indovinacanzone',
  'ic'
]
handler.tags = ['game', 'musica']
handler.command = /^(play|cerca|search|reproducir|jouer|abspielen|播放|播|воспроизвести|تشغيل|चलाओ|putar|çal|indovinacanzone|guessthesong|ic|adivinalacancion|adivinalacanción|adivinamusica|adivinamúsica|adivinhemusica|adivinhemúsica|rate_das_lied|猜歌|угадайпесню|خمن_الأغنية|गीत_पहचानो|devinelachanson|tebaklagu|şarkıyı_tahmin_et)$/i
handler.register = true
handler.group = true

export default handler