import axios from 'axios';

global.tiktokSeenVideosByChat = global.tiktokSeenVideosByChat || new Map();

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) {
        return conn.reply(m.chat, `
ㅤㅤ⋆｡˚『 ╭ \`TITOLO?\` ╯ 』˚｡⋆\n╭\n│
│  \`inserisci il titolo del video.\`
│
│ 『 📚 』 \`Esempio d'uso:\`
│ *${usedPrefix}${command} edit massimo bossetti*
│
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`, m)
    }

    await m.react('🔍');

    try {
        let allFetchedVideos = await tiktoks(text);

        if (allFetchedVideos.length === 0) {
            return conn.reply(m.chat, `\`Non ho trovato nessun video per "${text}", Prova con una ricerca diversa\``, m)
        }
        let selectedVideos = allFetchedVideos.slice(0, 5);
        const cards = selectedVideos.map((video) => {
            const author = video.author?.unique_id || 'Utente TikTok';
            return {
                video: { url: video.play },
                title: ``,
                body: ``,
                footer: '',
                buttons: [
                    {
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                            display_text: "📱 Apri su TikTok",
                            url: video.web_video_url || `https://www.tiktok.com/@${author}/video/${video.video_id}`
                        })
                    }
                ]
            };
        });

        await conn.sendMessage(
            m.chat,
            {
                text: `『 🔍 』 \`Risultati per:\` `,
                title: '',
                subtitle: 'chatunity',
                footer: `*${text}*`,
                cards: cards
            },
            { quoted: m }
        );

    } catch (e) {
        console.error('ERRORE nella ricerca TikTok:', e.message || e);
        await conn.reply(m.chat, `${global.errore}`, m);
    }
};

handler.help = ['tts <testo>'];
handler.tags = ['ricerca'];
handler.command = ['ttsearch', 'tiktoksearch', 'tts', 'tkshearch'];
handler.register = true;

export default handler;

async function tiktoks(query) {
    try {
        const response = await axios({
            method: 'POST',
            url: 'https://tikwm.com/api/feed/search',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Cookie': 'current_language=it',
                'User-Agent': 'varebot/2.5'
            },
            data: {
                keywords: query,
                count: 20,
                cursor: 0,
                HD: 1
            }
        });

        const videos = response.data?.data?.videos;
        if (!videos || videos.length === 0) {
            return [];
        }

        const validVideos = videos.filter(v => v.play);
        return validVideos;
    } catch (error) {
        console.error("Errore nella funzione tiktoks (API TikTok):", error.message || error);
        return [];
    }
}