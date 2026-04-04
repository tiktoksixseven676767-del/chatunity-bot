global.impiccato = global.impiccato || {};

let handler = async (m, { conn }) => {
    const chatId = m.chat;
    if (global.impiccato[chatId]) return m.reply("🏷️ C'è già una partita in corso!");

    const parole = ['MELA', 'BANANA', 'COMPUTER', 'PIZZA', 'CALCIO', 'CHITARRA', 'TELEFONO', 'STAZIONE', 'TRENO', 'LIBRO', 'DINOSAURO', 'CASA', 'SOLE', 'MARE', 'PANE', 'LIBRO', 'GATTO', 'CANE', 'FIORE', 'ALBERO', 'CITTA', 'STRADA', 'AMICO', 'SCUOLA', 'LAVORO', 'TEMPO', 'MONDO', 'NOTTE', 'GIORNO', 'CIELO', 'TERRA', 'FUOCO', 'ACQUA', 'VENTO', 'PIOGGIA', 'NEVE', 'MONTAGNA', 'PIANURA', 'FIUME', 'LAGO', 'PONTE', 'TRENO', 'AEREO', 'AUTO', 'BICICLETTA', 'PORTA', 'FINESTRA', 'MURO', 'TAVOLO', 'SEDIA', 'LETTO', 'CUCINA', 'BAGNO', 'PIATTO', 'BICCHIERE', 'COLTELLO', 'FORCHETTA', 'MELA', 'BANANA', 'ARANCIA', 'LIMONE', 'FRAGOLA', 'CILIEGIA', 'PESCA', 'CAROTA', 'PATATA', 'POMODORO', 'PASTA', 'PIZZA', 'CARNE', 'PESCE', 'UOVO', 'LATTE', 'CAFFE', 'THE', 'ZUCCHERO', 'SALE', 'PEPE', 'OLIO', 'BURRO', 'FORMAGGIO', 'CORPO', 'TESTA', 'MANO', 'PIEDE', 'BRACCIO', 'GAMBA', 'OCCHIO', 'BOCCA', 'NASO', 'CUORE', 'VESTITO', 'SCARPA', 'GUANTO', 'CAPPELLO', 'BORSA', 'VALIGIA', 'OROLOGIO', 'CHIAVE', 'MONETA', 'CARTA', 'PENNA', 'MATITA', 'QUADERNO', 'GIORNALE', 'MUSICA', 'FILM', 'GIOCO', 'SQUADRA', 'PALLA', 'STADIO', 'CHITARRA', 'PIANOFORTE', 'QUADRO', 'VERNICE', 'PENNELLO', 'MUSEO', 'TEATRO', 'POESIA', 'STORIA', 'SCIENZA', 'SPAZIO', 'PIANETA', 'STELLA', 'GALASSIA', 'RAZZO', 'DESERTO', 'GIUNGLA', 'BOSCO', 'PRATO', 'SCOGLIO', 'ISOLA', 'VULCANO', 'TERREMOTO', 'FULMINE', 'TUONO', 'NUVOLA', 'NEBBIA', 'GHIACCIO', 'SABBIA', 'CONCHIGLIA', 'BALENA', 'SQUALO', 'DELFINO', 'LEONE', 'TIGRE', 'ELEFANTE', 'GIRAFA', 'SCIMMIA', 'ORSO', 'LUPO', 'VOLPE', 'AQUILA', 'GUFO', 'PAPPAGALLO', 'APE', 'FARFALLA', 'RAGNO', 'SERPENTE', 'RANA', 'TARTARUGA', 'CAVALLO', 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAAAAAAAAAAAAAAAAAAA', 'PECORA', 'MAIALE', 'GALLINA', 'CONIGLIO', 'TOPOLINO', 'BOTTIGLIA', 'SCATOLA', 'PACCO', 'CESTO', 'SACCO', 'OMBRELLO', 'ZAINO', 'OCCHIALI', 'SPECCHIO', 'PETTINE', 'SAPONE', 'ASCIUGAMANO', 'DENTIFRICIO', 'SVEGLIA', 'LAMPADA', 'CANCELLO', 'GIARDINO', 'BALCONE', 'TETTO', 'CAMINO', 'SOFFITTA', 'CANTINA', 'SCALA', 'ASCENSORE', 'UFFICIO', 'BANCA', 'OSPEDALE', 'CHIESA', 'NEGOZIO', 'MERCATO', 'RISTORANTE', 'ALBERGO', 'SPIAGGIA', 'PORTO', 'VILLAGGIO', 'CAMPER', 'BARCA', 'NAVE', 'SOTTOMARINO', 'ELICOTTERO', 'MOTO', 'CAMION', 'RUSPA', 'NEGRO', 'EASTEREGG', 'MAZZUBELLO', 'EPSTAIN', 'BRRBRRPATAPIM' ];
    const scelta = parole[Math.floor(Math.random() * parole.length)];

    global.impiccato[chatId] = {
        parola: scelta,
        indovinate: [],
        errori: 0,
        maxErrori: 6
    };

    const s = global.impiccato[chatId];
    let display = s.parola.split('').map(l => s.indovinate.includes(l) ? l : '_').join(' ');

    // Nuova immagine generica (Link stabile)
    await conn.sendMessage(chatId, { 
        image: { url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg_qNpM5Swv2TfF2j8jAkFKvFRRWLMjETdTeS0SZxp3g&s=10' },
        caption: `🎮 *GIOCO DELL'IMPICCATO* 🎮\n\nParola: \`${display}\` \n\nErrori: ${s.errori}/${s.maxErrori}\n\nScrivi una lettera per iniziare!`
    }, { quoted: m });
};

handler.command = /^(impiccato|hang)$/i;
export default handler;
