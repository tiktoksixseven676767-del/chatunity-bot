import axios from 'axios'

global.bombaSessions = global.bombaSessions || {};

let handler = m => m;

handler.before = async function (m, { conn }) {
    const chatId = m.chat;
    const senderId = m.sender;
    const session = global.bombaSessions[chatId];

    if (!session || session.status !== 'attiva') return;
    
    let risposta = m.text ? m.text.trim().toLowerCase() : "";
    if (risposta.length < 3) return; 

    // Solo se inizia con la lettera giusta
    if (!risposta.startsWith(session.lettera.toLowerCase())) return;

    // Solo se è il turno del possessore o se la bomba è libera
    if (session.possessore && session.possessore !== senderId) return;

    // --- NUOVO CONTROLLO PAROLA (Più preciso) ---
    async function esegueControllo(parola) {
        try {
            // Usiamo l'API di Google Dizionario (tramite un proxy affidabile)
            const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/it/${encodeURIComponent(parola)}`)
            return res.status === 200;
        } catch (e) {
            // Se il dizionario specifico fallisce, usiamo un fallback su Wiktionary corretto
            try {
                const fallback = await axios.get(`https://it.wiktionary.org/api/rest_v1/page/title/${encodeURIComponent(parola)}`)
                return fallback.status === 200;
            } catch (err) {
                return false;
            }
        }
    }

    const isValid = await esegueControllo(risposta);
    
    if (!isValid) {
        // Se la parola è chiaramente inventata (poche vocali o lettere a caso) la bocciamo
        // Ma se sembra una parola umana, potresti voler essere meno severo
        return m.reply(`❌ *"${risposta.toUpperCase()}"* non è nel dizionario!`);
    }

    // --- LOGICA DI PASSAGGIO ---
    if (session.possessore === senderId) {
        session.lettera = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V'][Math.floor(Math.random() * 15)];
        session.possessore = null; 
        
        await conn.sendMessage(chatId, {
            text: `✅ *PAROLA VALIDA!* @${senderId.split('@')[0]} ha lanciato la bomba!\n\n🔥 La bomba ora è *LIBERA*!\nIl primo che scrive una parola con *${session.lettera}* la prende!`,
            mentions: [senderId]
        });
    } else if (!session.possessore) {
        session.possessore = senderId;
        await conn.sendMessage(chatId, {
            text: `🏃‍♂️ @${senderId.split('@')[0]} ha preso la bomba! \nScrivi subito un'altra parola con *${session.lettera}* per passarla!`,
            mentions: [senderId]
        });
    }

    return true;
};

export default handler;
