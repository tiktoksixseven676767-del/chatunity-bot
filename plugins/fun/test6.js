const SpotifyWebApi = require('spotify-web-api-node');

// Configurazione con le tue chiavi
const spotifyApi = new SpotifyWebApi({
    clientId: '8d6cd94dcd054cd2b82d27495208d56d',
    clientSecret: 'b0e5e8b3116d4b66b3b9f2a546069b6a'
});

// Autenticazione automatica
async function connectToSpotify() {
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(data.body['access_token']);
        console.log('✅ [Spotify] Connesso correttamente');
    } catch (err) {
        console.error('❌ [Spotify] Errore login:', err);
    }
}

// Avvio connessione
connectToSpotify();
setInterval(connectToSpotify, 1000 * 60 * 50); // Rinnova ogni 50 min

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`🎵 Inserisci il titolo di una canzone!\nEs: *${usedPrefix + command} Imagine Dragons Believer*`);

    try {
        // Reazione di caricamento
        if (conn.sendMessage) await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

        const res = await spotifyApi.searchTracks(text, { limit: 1 });
        const track = res.body.tracks.items[0];

        if (!track) return m.reply('❌ Nessun risultato trovato.');

        const info = {
            titolo: track.name,
            artista: track.artists.map(a => a.name).join(', '),
            album: track.album.name,
            url: track.external_urls.spotify,
            img: track.album.images[0]?.url,
            audio: track.preview_url
        };

        let testo = `🎧 *SPOTIFY PLAY*\n\n` +
                    `📌 *Titolo:* ${info.titolo}\n` +
                    `👤 *Artista:* ${info.artista}\n` +
                    `💿 *Album:* ${info.album}\n\n` +
                    `🔗 *Link:* ${info.url}`;

        // Invio immagine + info
        await conn.sendMessage(m.chat, { 
            image: { url: info.img }, 
            caption: testo 
        }, { quoted: m });

        // Invio anteprima audio (se disponibile)
        if (info.audio) {
            await conn.sendMessage(m.chat, { 
                audio: { url: info.audio }, 
                mimetype: 'audio/mpeg', 
                ptt: false 
            }, { quoted: m });
        }

    } catch (e) {
        console.error(e);
        m.reply('❗ Errore durante la ricerca. Verifica che le chiavi API siano attive.');
    }
};

handler.help = ['play'];
handler.tags = ['music'];
handler.command = /^(playtest|spotify)$/i;

module.exports = handler;
