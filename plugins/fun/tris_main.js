// Inizializza l'oggetto globale se non esiste
global.tris = global.tris || {};

let handler = async (m, { conn, usedPrefix, command }) => {
    const chatId = m.chat;

    // Controllo se c'è già una partita attiva nel gruppo
    if (global.tris[chatId]) {
        return m.reply(`⚠️ C'è già una sfida in corso! Finiscila prima di iniziarne un'altra.`);
    }

    // Configurazione iniziale della scacchiera (1-9)
    const board = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    // Creazione della sessione di gioco
    global.tris[chatId] = {
        board,
        turn: m.sender, // Il primo turno è di chi lancia il comando
        status: 'playing',
        winner: null,
        lastMsg: null
    };

    // Funzione interna per renderizzare la griglia testuale sotto l'immagine
    const renderBoard = (b) => {
        return `❌ *SFIDA A TRIS* ⭕\n\n` +
               `  ${b[0]} | ${b[1]} | ${b[2]}\n` +
               `  ----------\n` +
               `  ${b[3]} | ${b[4]} | ${b[5]}\n` +
               `  ----------\n` +
               `  ${b[6]} | ${b[7]} | ${b[8]}\n\n` +
               `👤 *Sfidante:* @${m.sender.split('@')[0]}\n` +
               `👉 *Tocca a te!* Rispondi al messaggio con un numero da *1* a *9* per segnare la tua mossa.`;
    };

    // Invio dell'immagine di Vecteezy e del messaggio di sfida
    try {
        let msg = await conn.sendMessage(chatId, { 
            image: { url: 'https://static.vecteezy.com/ti/vettori-gratis/p1/6409900-tic-tac-toe-sketched-isolato-gioco-vintage-in-stile-disegnato-a-mano-vettoriale.jpg' },
            caption: renderBoard(board),
            mentions: [m.sender]
        }, { quoted: m });

        // Salviamo l'ID del messaggio se serve per futuri edit (opzionale)
        global.tris[chatId].lastMsg = msg.key.id;

    } catch (e) {
        // Fallback in caso di errore caricamento immagine
        console.error("Errore invio immagine Tris:", e);
        await m.reply(renderBoard(board));
    }
};

// Comandi per attivare il gioco
handler.command = /^(tris|tictactoe|ttt)$/i;
handler.group = true; // Consigliato per evitare spam in privato

export default handler;
