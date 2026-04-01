global.bombaSessions = global.bombaSessions || {};

let handler = m => m;

handler.before = async function (m, { conn }) {
    const chatId = m.chat;
    const senderId = m.sender;
    const session = global.bombaSessions[chatId];

    if (!session || session.status !== 'attiva') return;
    
    let risposta = m.text ? m.text.trim().toUpperCase() : "";
    
    // Se il possessore risponde correttamente
    if (session.possessore === senderId && risposta.startsWith(session.lettera) && risposta.length >= 3) {
        session.lettera = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V'][Math.floor(Math.random() * 15)];
        session.possessore = null; 
        
        await conn.sendMessage(chatId, {
            text: `✅ *SALVO!* @${senderId.split('@')[0]} si è liberato della bomba!\n\n🔥 La bomba ora è *LIBERA*!\nIl primo che scrive una parola con *${session.lettera}* la prende!`,
            mentions: [senderId]
        });
        return true;
    }

    // Se la bomba è libera e qualcuno la prende
    if (!session.possessore && risposta.startsWith(session.lettera) && risposta.length >= 3) {
        session.possessore = senderId;
        await conn.sendMessage(chatId, {
            text: `🏃‍♂️ @${senderId.split('@')[0]} ha preso la bomba! \nScrivi subito un'altra parola con *${session.lettera}* per passarla!`,
            mentions: [senderId]
        });
        return true;
    }

    return;
};

export default handler;
