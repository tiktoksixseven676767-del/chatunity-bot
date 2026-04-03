 import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (message, { conn, usedPrefix, command }) => {
    const userId = message.sender;
    const groupId = message.isGroup ? message.chat : null;

    const menuText = generateMenuText(usedPrefix, userId, groupId);
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

handler.help = [
  'menugruppo',
  'gruppo',
  'groupmenu',
  'group',
  'menúgrupo',
  'grupo',
  'menugrupo',
  'grupo_pt',
  'gruppenmenü',
  'gruppe',
  '群组菜单',
  '群组',
  'менюгруппы',
  'группа',
  'قائمةالمجموعة',
  'مجموعة',
  'समूहमेनू',
  'समूह',
  'menu_groupe',
  'groupe',
  'menugrup',
  'grup',
  'grupmenü'
];
handler.tags = ['menu'];
handler.command = /^(gruppo|menugruppo|groupmenu|group|menúgrupo|grupo|menugrupo|grupo_pt|gruppenmenü|gruppe|群组菜单|群组|менюгруппы|группа|قائمةالمجموعة|مجموعة|समूहमेनू|समूह|menu_groupe|groupe|menugrup|grup|grupmenü)$/i;


export default handler;

function generateMenuText(prefix, userId, groupId) {
    const vs = global.vs || '8.0';
    const collab = global.collab || 'ChatUnity x 333';
    const menuTitle = global.t('groupMenuTitle', userId, groupId);

    const createSection = (title, commands) => {
        const commandLines = commands.trim().split('\n').map(c => `│ ${c.trim()}`).join('\n');
        return `╭★ ${title} ★╮\n${commandLines}\n╰★────────────★╯`;
    };

    const sections = [
        createSection(global.t('musicAudioSection', userId, groupId), `
🎵 *.play* (${global.t('songCommand', userId, groupId)})
🎥 *.playlist*
🎥 *.ytsearch*
🌐 *.tts*
🌍 *.GitHubsearch*
🔊 *.tomp3* (${global.t('videoCommand', userId, groupId)})`),
        createSection(global.t('infoUtilitySection', userId, groupId), `
🌍 *.meteo* (${global.t('cityCommand', userId, groupId)})
ℹ️ *.lookup*
🔥 *.ip*
📨 *.creamail*
🌐 *.traduci* (${global.t('textCommand', userId, groupId)})
ℹ️ *.info* [@${global.t('userCommand', userId, groupId)}]
📜 *.regole*
📜 *.dashboard*
🛡️ *.offusca*`),
        createSection(global.t('imageEditSection', userId, groupId), `
🛠️ *.sticker* (${global.t('photoToStickerCommand', userId, groupId)})
📷 *.hd* (${global.t('improveQualityCommand', userId, groupId)})
🤕 *.bonk* (${global.t('memeCommand', userId, groupId)})
🖼️ *.toimg* (${global.t('fromStickerCommand', userId, groupId)})
🎴 *.hornycard* [@${global.t('userCommand', userId, groupId)}]
🧠 *.stupido/a* @
🌀 *.emojimix*
🎯 *.wanted* @
🤡 *.scherzo* @
📱 *.nokia* @
🚔 *.carcere* @
📢 *.ads* @`),
        createSection(global.t('pokemonSection', userId, groupId), `
🥚 *.apripokemon*
🛒 *.buypokemon* 
🏆 *.classificapokemon*
🎁 *.pacchetti*
⚔️ *.combatti*
🔄 *.evolvi*
🌑 *.darknessinfo*
🎒 *.inventario*
🍀 *.pity*
🔄 *.scambia*`),
        createSection(global.t('gamesCasinoSection', userId, groupId), `
🎮 *.tris*
🎲 *.dado*
🧑🏻‍💼 *.impiccato*
💣 *.minato*
🎰 *.slot*
🏏 *.casinò*
💰 *.scommessa* (${global.t('quantityCommand', userId, groupId)})
💰 *.blackjack*
💰 *.wordle*
🔫 *.roulette*
ℹ️ *.infograttaevinci*
🪙 *.moneta* (${global.t('headsOrTailsCommand', userId, groupId)})
🧮 *.mate* (${global.t('mathProblemCommand', userId, groupId)})
📈 *.scf* (${global.t('rockPaperScissorsCommand', userId, groupId)})
🐾 *.pokedex* (${global.t('pokemonInfoCommand', userId, groupId)})
🏳️ *.bandiera*
🎶 *.indovinacanzone*
🤖 *.auto*
🎯 *.missioni*`),
        createSection(global.t('economyRankingSection', userId, groupId), `
💰 *.portafoglio* (${global.t('balanceCommand', userId, groupId)})
🏦 *.banca*
💸 *.daily*
🏆 *.topuser* (${global.t('topUsersCommand', userId, groupId)})
🏆 *.topgruppi*
💳 *.donauc*
🤑 *.ruba* @${global.t('userCommand', userId, groupId)}
📤 *.ritira* (${global.t('withdrawUCCommand', userId, groupId)})
⛏️ *.mina* (${global.t('earnXPCommand', userId, groupId)})
📊 *.xp*
♾️ *.donaxp* @${global.t('userCommand', userId, groupId)}
🎯 *.rubaxp* @${global.t('userCommand', userId, groupId)}`),
        createSection(global.t('socialInteractionSection', userId, groupId), `
💔 *.divorzia* (${global.t('endRelationshipCommand', userId, groupId)})
💌 *.amore* @${global.t('userCommand', userId, groupId)} (${global.t('affinityCommand', userId, groupId)})
💋 *.bacia* @${global.t('userCommand', userId, groupId)}
😡 *.odio* @${global.t('userCommand', userId, groupId)}
🗣️ *.rizz* @${global.t('userCommand', userId, groupId)} (${global.t('charmCommand', userId, groupId)})
☠️ *.minaccia* @${global.t('userCommand', userId, groupId)}
🔥 *.zizzania* @${global.t('userCommand', userId, groupId)} (${global.t('createFightCommand', userId, groupId)})
💋 *.ditalino* @
💋 *.sega* @
🖕 *.insulta* @
👥 *.amicizia/listamici* @`),
        createSection(global.t('howMuchSection', userId, groupId), `
🏳️‍🌈 *.lesbica* @
⚫ *.negro* @
🐓 *.cornuto* @`),
        createSection(global.t('personalityTestSection', userId, groupId), `
🍺 *.alcolizzato*
🌿 *.drogato*`)
    ];

    return `
╭┈ ─ ─ ✦ ─ ─ ┈╮
   ୧ 👑 ୭ *${menuTitle}*
╰┈ ─ ─ ✦ ─ ─ ┈╯

꒷꒦ ✦ ${global.t('memberCommands', userId, groupId)} ✦ ꒷꒦

${sections.join('\n\n')}

╭★────★────★╮
│ ୭ ˚. ᵎᵎ 🎀
│ ${global.t('versionLabel', userId, groupId)}: ${vs}
╰★────★────★╯`.trim();
}