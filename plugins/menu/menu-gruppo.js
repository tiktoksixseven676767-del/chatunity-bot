import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (message, { conn, usedPrefix, command }) => {
    const userId = message.sender;
    const groupId = message.isGroup ? message.chat : null;

    const menuText = generateMenuText(usedPrefix, userId, groupId);
    // Assicurati che il percorso dell'immagine sia corretto rispetto alla cartella del plugin
    const imagePath = path.join(__dirname, '../../media/gruppo.jpeg');

    const footerText = global.t('chooseMenu', userId, groupId) || 'Scegli un menu:';
    const mainMenuText = global.t('mainMenuButton', userId, groupId) || '🏠 Menu Principale';
    const adminMenuText = global.t('menuAdmin', userId, groupId) || '🛡️ Menu Admin';
    const ownerMenuText = global.t('menuOwner', userId, groupId) || '👑 Menu Owner';
    const securityMenuText = global.t('menuSecurity', userId, groupId) || '🚨 Menu Sicurezza';

    await conn.sendMessage(message.chat, {
        image: { url: imagePath },
        caption: menuText,
        footer: footerText,
        buttons: [
            { buttonId: `${usedPrefix}menu`, buttonText: { displayText: mainMenuText }, type: 1 },
            { buttonId: `${usedPrefix}menuadmin`, buttonText: { displayText: adminMenuText }, type: 1 },
            { buttonId: `${usedPrefix}menuowner`, buttonText: { displayText: ownerMenuText }, type: 1 },
            { buttonId: `${usedPrefix}menusicurezza`, buttonText: { displayText: securityMenuText }, type: 1 },
        ],
        viewOnce: true,
        headerType: 4,
    }, { quoted: message });
};

handler.help = ['menugruppo', 'gruppo', 'groupmenu'];
handler.tags = ['menu'];
handler.command = /^(gruppo|menugruppo|groupmenu|group|menúgrupo|grupo|grupo_pt|gruppenmenü|gruppe|群组菜单|群组|менюгруппы|группа|قائمةالمجموعة|مجموعة|समूहमेनू|समूह|menu_groupe|groupe|menugrup|grup|grupmenü)$/i;

export default handler;

function generateMenuText(prefix, userId, groupId) {
    const vs = global.vs || '8.0';
    const menuTitle = global.t('groupMenuTitle', userId, groupId) || 'MENU GRUPPO';

    const createSection = (title, commands) => {
        const commandLines = commands.trim().split('\n').map(c => `│ ${c.trim()}`).join('\n');
        return `╭★ ${title} ★╮\n${commandLines}\n╰★────────────★╯`;
    };

    const sections = [
        createSection(global.t('musicAudioSection', userId, groupId), `
🎵 *.play*
🎥 *.playlist*
🎥 *.ytsearch*
🔊 *.tomp3*`),
        createSection(global.t('infoUtilitySection', userId, groupId), `
🌍 *.meteo*
📦 *.track*
💻 *.ip*
💻 *.lookup*
🌐 *.tts*
🌐 *.traduci*
ℹ️ *.info*
📜 *.regole*
📜 *.dashboard*
🛡️ *.offusca*`),
        createSection(global.t('imageEditSection', userId, groupId), `
🛠️ *.sticker*
📷 *.hd*
🖼️ *.toimg*
🖨️ *.rivela*
🎴 *.hornycard*
🧠 *.stupido/a*
🎯 *.wanted*
🚔 *.carcere*`),
        createSection("POKEMON", `
🥚 *.apripokemon*
🛒 *.buypokemon*
🏆 *.classificapokemon*
🎁 *.pacchetti*
⚔️ *.combatti*
🔄 *.evolvi*
🎒 *.inventario*
🔄 *.scambia*`),

        // --- SEZIONE NUOVA ---
        createSection("ACQUISTABILI", `
📢 *.tagall* (100k UC)
👮‍♂️ *.acquistapolizia* (50k UC)

🛒 *.buygrattavinci* 100k 
🛒 *.buygrattavinci* milionario 
🛒 *.buygrattavinci* miliardario 
🔓 *.aprigrattavinci* {tipo}
🎒 *.inventariograttavinci*`)
👆🏻 *infograttaevinci*`,
        // ---------------------------
        createSection(global.t('gamesCasinoSection', userId, groupId), `
🎮 *.tris*
🎰 *.slot*
🎲 *.dado*
💰 *.blackjack*
🔫 *.roulette*
💣 *.minato*
🧑🏻‍💼 *.impiccato*`),
        createSection(global.t('economyRankingSection', userId, groupId), `
💰 *.portafoglio*
🏦 *.banca*
💸 *.daily*
🏆 *.topuser*
🤑 *.ruba*
⛏️ *.mina*
📊 *.xp*`),
        createSection(global.t('socialInteractionSection', userId, groupId), `
💌 *.amore*
💋 *.bacia*
🗣️ *.rizz*
🍆 *.sega*
🍑 *.ditalino*
🔥 *.scopa*
🖕 *.insulta*
👥 *.amicizia*`)
    ];

    return `
╭┈ ─ ─ ✦ ─ ─ ┈╮
   ୧ 👑 ୭ *${menuTitle}*
╰┈ ─ ─ ✦ ─ ─ ┈╯

꒷꒦ ✦ ${global.t('memberCommands', userId, groupId) || 'COMANDI UTENTI'} ✦ ꒷꒦

${sections.join('\n\n')}

╭★────★────★╮
│ ୭ ˚. ᵎᵎ 🎀
│ Versione: ${vs}
╰★────★────★╯`.trim();
}
