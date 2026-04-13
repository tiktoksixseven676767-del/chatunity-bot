import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply('Inserisci un link di YouTube!')
    await m.reply('⏳ Scaricamento in corso...')

    try {
        // Usiamo un'API che gestisce i blocchi di YouTube per noi
        let res = await fetch(`https://api.lolhuman.xyz/api/yt2mp3?apikey=85faf717d0545d14074659ad&url=${args[0]}`)
        let json = await res.json()

        if (json.status !== 200) throw 'Errore nel download'

        await conn.sendMessage(m.chat, { 
            audio: { url: json.result.link }, 
            mimetype: 'audio/mpeg',
            fileName: `${json.result.title}.mp3`
        }, { quoted: m })
    } catch (e) {
        m.reply('❌ Errore: Prova con un altro link o riprova più tardi.')
    }
}
handler.command = ['audio', 'yta']
export default handler
