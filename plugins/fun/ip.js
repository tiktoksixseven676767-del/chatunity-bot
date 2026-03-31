import fetch from 'node-fetch'

let handler = async (m, { text, conn }) => {
  if (!text) return conn.reply(m.chat, '❌ Inserisci un indirizzo IP o un dominio.', m)
  
  try {
    let res = await fetch(`http://ip-api.com/json/${text}?fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,query`)
    let json = await res.json()
    
    if (json.status !== 'success') throw 'IP non trovato'
    
    let txt = `『 🌐 *IP LOOKUP* 』\n\n`
    txt += `*• IP:* ${json.query}\n`
    txt += `*• Nazione:* ${json.country} (${json.countryCode})\n`
    txt += `*• Città:* ${json.city}\n`
    txt += `*• ISP:* ${json.isp}\n`
    txt += `*• Fuso Orario:* ${json.timezone}\n`
    txt += `*• Lat/Lon:* ${json.lat}, ${json.lon}`

    await conn.reply(m.chat, txt, m)
  } catch (e) {
    conn.reply(m.chat, '❌ Errore durante la ricerca dell\'IP.', m)
  }
}
handler.command = ['ipinfo', 'ip']
export default handler
