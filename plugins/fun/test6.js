import SpotifyWebApi from 'spotify-web-api-node';

// Configurazione con le tue credenziali
const spotifyApi = new SpotifyWebApi({
    clientId: '8d6cd94dcd054cd2b82d27495208d56d',
    clientSecret: 'b0e5e8b3116d4b66b3b9f2a546069b6a'
});

// Funzione per gestire l'autenticazione
async function refreshSpotifyToken() {
    try {
        const data = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(data.body['access_token']);
        console.log('✅ Connessione a Spotify stabilita con successo.');
    } catch (err) {
        console.error('❌ Errore di autenticazione Spotify:', err);
    }
}

// Inizializzazione
refreshSpotifyToken();
setInterval(refreshSpotifyToken, 1000 * 60 * 50); // Rinnovo ogni 50 minuti

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, `🎵 Scrivi il nome di una canzone.\nEs: *${usedPrefix + command} Blinding Lights*`, m);

    try {
        await conn.sendMessage(m.chat, { react: { text: '🎧', key: m.key } });

        // Ricerca su Spotify
        const searchResponse = await spotifyApi.searchTracks(text, { limit: 1 });
        const tracks = searchResponse.body.tracks.items;

        if (tracks.length === 0) {
            return conn.reply(m.chat, '❓ Non ho trovato nulla su Spotify con questo nome.', m);
        }

        const track = tracks[0];
        const info = {
            titolo: track.name,
            artista: track.artists.map(a => a.name).join(', '),
            album: track.album.name,
            url: track.external_urls.spotify,
            anteprima: track.preview_url,
            cover: track.album.images[0]?.url
        };

        let messaggio = `✅ *Risultato trovato!*\n\n` +
                        `🎼 *Titolo:* ${info.titolo}\n` +
                        `🎤 *Artista:* ${info.artista}\n` +
                        `💿 *Album:* ${info.album}\n\n` +
                        `🔗 [Apri su Spotify](${info.url})`;

        // Invia copertina e info
        await conn.sendMessage(m.chat, { 
            image: { url: info.cover }, 
            caption: messaggio 
        }, { quoted: m });

        // Invia l'anteprima audio se disponibile
        if (info.anteprima) {
            await conn.sendMessage(m.chat, { 
                audio: { url: info.anteprima }, 
                mimetype: 'audio/mpeg', 
                ptt: false 
            }, { quoted: m });
        } else {
            conn.reply(m.chat, '⚠️ Nota: Anteprima audio non disponibile per questo brano.', m);
        }

    } catch (error) {
        console.error(error);
        conn.reply(m.chat, '❌ Errore durante la ricerca. Riprova più tardi.', m);
    }
};

handler.help = ['play <canzone>'];
handler.tags = ['music'];
handler.command = /^(play|musica|spotify)$/i;

export default handler;
