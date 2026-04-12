var handler = async (m, { conn, usedPrefix }) => {
    let nomeDelBot = global.nomebot || 'ChatUnity-Bot'
    let testo = `🎮 *MENU GIOCHI - ${nomeDelBot}* 🎮\n\n`
    
    testo += `✨ *POKÉMON ADVENTURE* ✨\n`
    testo += `🥚 *.apripokemon* - Trova nuovi Pokémon\n`
    testo += `🛒 *.buypokemon* - Negozio Pokémon\n`
    testo += `🏆 *.classificapokemon* - I migliori allenatori\n`
    testo += `🎁 *.pacchetti* - Apri pacchetti rari\n`
    testo += `⚔️ *.combatti* - Sfida i tuoi amici\n`
    testo += `🔄 *.evolvi* - Potenzia i tuoi Pokémon\n`
    testo += `🐾 *.pokedex* - La tua collezione\n\n`

    testo += `🧠 *SFIDE E LOGICA* 🧠\n`
    testo += `🧑🏻‍💼 *.impiccato* - Indovina la parola\n`
    testo += `🏳️ *.bandiera* - Quiz sulle bandiere\n`
    testo += `🎶 *.indovinacanzone* - Sfida musicale\n`
    testo += `🧮 *.mate* - Calcoli veloci\n`
    testo += `💰 *.wordle* - Trova la parola segreta\n\n`

    testo += `🎲 *DIVERTIMENTO* 🎲\n`
    testo += `🎲 *.dado* - Lancia un dado\n`
    testo += `🪙 *.moneta* - Testa o croce\n`
    testo += `🎰 *.slot* - slot maccine\n`
    testo += `🏏 *.casinò* - casinò
    testo += `🔫 *.roulette* - roulette maccine\n`
    testo += `📈 *.scf* - Sasso, Carta, Forbice\n`
    testo += `🎒 *.inventario* - Controlla i tuoi oggetti\n\n`
    
    testo += `📢 *INFO* 📢\n`
    testo += `Iscriviti al canale: ${global.canal}`

    await conn.sendMessage(m.chat, {
        text: testo,
        contextInfo: {
            externalAdReply: {
                title: `Divertiti con i tuoi amici!`,
                body: nomeDelBot,
                thumbnail: fs.readFileSync('./media/principale.jpeg'),
                sourceUrl: global.canal,
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m })
}

handler.command = /^(games|giochi)$/i
handler.group = true

export default handler
