global.bombaSessions = global.bombaSessions || {};

let handler = m => m;

handler.before = async function (m, { conn }) {
    const chatId = m.chat;
    const senderId = m.sender;
    const session = global.bombaSessions[chatId];

    if (!session || session.status !== 'attiva') return;
    if (session.possessore !== senderId) return; // Solo chi ha la bomba può rispondere

    let risposta = m.text ? m.text.trim().toUpperCase() : "";
    
    // Controllo validità: inizia con la lettera corretta e ha almeno 3 lettere
    if (risposta.startsWith(session.lettera) && risposta.length >= 3) {
        // Scegli una nuova vittima a caso tra chi è nel gruppo (o chi ha partecipato)
        // Per semplicità qui la bomba viene "lanciata" a chi risponde dopo o rimane libera
        
        session.lettera = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V'][Math.floor(Math.random() * 15)];
        session.possessore = ""; // Diventa libera per il prossimo che sbaglia o chi la prende
        
        let msg = await conn.sendMessage(chatId, {
            text: `✅ Parola corretta! La bomba è stata lanciata lontano!\n\n🔥 Ora la bomba è LIBERA. Il primo che scrive una parola con *${session.lettera}* la passa a qualcun altro!`
        });
        
        // Aggiorniamo la logica: il primo che scrive una parola la "molla" a un altro
        // In questa versione semplificata, chi risponde correttamente si salva e la bomba aspetta la prossima vittima
        session.possessore = null; 
    } else if (risposta.length > 0 && session.possessore === senderId) {
        // Se scrive ma sbaglia la lettera
        // m.reply(`❌ La parola deve iniziare con ${session.lettera}!`);
    }

    return;
};

export default handler;
