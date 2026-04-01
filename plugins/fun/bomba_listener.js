global.bombaSessions = global.bombaSessions || {};

let handler = m => m;

handler.before = async function (m, { conn }) {
    const chatId = m.chat;
    const senderId = m.sender;
    const session = global.bombaSessions[chatId];

    if (!session || session.status !== 'attiva') return;
    
    // Solo il possessore attuale può "disinnescare" e passare la bomba
    if (session.possessore !== senderId) return;

    let risposta = m.text ? m.text.trim().toUpperCase() : "";
    
    if (risposta.startsWith(session.lettera) && risposta.length >= 3) {
        // Cambia lettera e libera la bomba per il prossimo
        session.lettera = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V'][Math.floor(Math.random() * 15)];
        session.possessore = null; // Ora la bomba è "libera", il primo che scrive la prende e la lancia
        
        await conn.sendMessage(chatId, {
            text: `✅ *SALVO!* @${senderId.split('@')[0]} ha lanciato la bomba!\n\n🔥 La bomba ora è LIBERA!\nIl primo che scrive una parola con *${session.lettera}* la prende e la lancia a qualcun altro!`,
            mentions: [senderId]
        });
    }

    // Se la bomba è libera e qualcuno scrive una parola corretta, diventa lui il possessore
    if (!session.possessore && risposta.startsWith(session.lettera) && risposta.length >= 3) {
        session.possessore = senderId;
        await conn.sendMessage(chatId, {
            text: `🏃‍♂️ @${senderId.split('@')[0]} ha preso la bomba! \nSbrigati a scrivere un'altra parola con *${session.lettera}* per passarla!`,
            mentions: [senderId]
        });
    }

    return;
};

export default handler;
