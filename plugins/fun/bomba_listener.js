import axios from 'axios'

global.bombaSessions = global.bombaSessions || {};

let handler = m => m;

handler.before = async function (m, { conn }) {
    const chatId = m.chat;
    const senderId = m.sender;
    const session = global.bombaSessions[chatId];

    if (!session || session.status !== 'attiva') return;
    
    let risposta = m.text ? m.text.trim().toLowerCase() : "";
    if (risposta.length < 3) return; // Troppo corta

    // --- FUNZIONE CONTROLLO PAROLA REALE ---
    async function esegueControllo(parola) {
        try {
            // Usiamo un'API di dizionario o un controllo di Free Dictionary
            // Nota: Se l'API non trova la parola, restituisce errore 404
            const res = await axios.get(`https://it.wiktionary.org/w/api.php?action=query&titles=${encodeURIComponent(parola)}&format=json`)
            const pages = res.data.query.pages;
            return !pages["-1"]; // Se la pagina esiste, la parola è valida
        } catch (e) {
            return false;
        }
    }

    // Se la parola non inizia con la lettera corretta, ignora
    if (!risposta.startsWith(session.lettera.toLowerCase())) return;

    // Controllo se è il turno del possessore o se la bomba è libera
    if (session.possessore && session.possessore !== senderId) return;

    // Validazione parola reale
    const isValid = await esegueControllo(risposta);
    if (!isValid) {
        return m.reply(`❌ *"${risposta.toUpperCase()}"* non sembra una parola italiana valida! Riprova.`);
    }

    // --- LOGICA DI PASSAGGIO ---
    if (session.possessore === senderId) {
        // Il possessore ha risposto bene: la lancia
        session.lettera = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V'][Math.floor(Math.random() * 15)];
        session.possessore = null; 
        
        await conn.sendMessage(chatId, {
            text: `✅ *PAROLA VALIDA!* @${senderId.split('@')[0]} ha lanciato la bomba!\n\n🔥 La bomba ora è *LIBERA*!\nIl primo che scrive una parola con *${session.lettera}* la prende!`,
            mentions: [senderId]
        });
    } else if (!session.possessore) {
        // La bomba era libera e qualcuno l'ha presa
        session.possessore = senderId;
        await conn.sendMessage(chatId, {
            text: `🏃‍♂️ @${senderId.split('@')[0]} ha preso la bomba! \nPresto, scrivi un'altra parola con *${session.lettera}* per passarla!`,
            mentions: [senderId]
        });
    }

    return true;
};

export default handler;
