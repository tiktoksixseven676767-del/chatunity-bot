let handler = async (m, { conn }) => {
    // 1. Svuota le sessioni del Tris (global.trisSessions)
    const trisCount = Object.keys(global.trisSessions || {}).length;
    global.trisSessions = {};

    // 2. Svuota eventuali altre code di gioco temporanee
    const connGameCount = Object.keys(conn.game || {}).length;
    conn.game = {};

    // 3. Conferma dell'operazione
    let report = `🧹 *PULIZIA SESSIONI COMPLETATA*\n\n`;
    report += `🎮 Partite Tris cancellate: ${trisCount}\n`;
    report += `🎲 Altri mini-giochi resettati: ${connGameCount}\n\n`;
    report += `💰 *INFO:* I portafogli e gli UC degli utenti non sono stati toccati.`;

    await m.reply(report);
};

handler.help = ['sessioni'];
handler.tags = ['owner'];
handler.command = /^(sessioni|resetsessioni)$/i;
handler.rowner = true; // Solo tu puoi farlo

export default handler;
