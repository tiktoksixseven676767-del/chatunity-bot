//plugin by Giuse
let handler = async (m, { conn }) => {

    // Newsletter globale ChatUnity
    const cuContext = {
        isForwarded: true,
        forwardingScore: 999,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363259442839354@newsletter',
            serverMessageId: 100,
            newsletterName: `𝐂𝐡𝐚𝐭𝐔𝐧𝐢𝐭𝐲-𝐁𝐨𝐭 ✦ Staff Ufficiale`
        }
    };

    // Schede di contatto (vCard)
    const vcards = [
        { vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;mazzu | CEO;;;\nFN:mazzu | CEO\nORG:𝐂𝐡𝐚𝐭𝐔𝐧𝐢𝐭𝐲\nTITLE:CEO\nitem1.TEL;waid=3393391952345:+39 3391952345\nitem1.X-ABLabel:Cellulare\nEND:VCARD` },
        { vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;mazzu (bot);;;\nFN:mazzu\nORG:𝐂𝐡𝐚𝐭𝐔𝐧𝐢𝐭𝐲\nTITLE:Staff\nitem1.TEL;waid=212783587782:+212 783-587782\nitem1.X-ABLabel:Cellulare\nEND:VCARD` },
   

    // Testo elegante con i numeri in chiaro
    let testo = `
୧・︶ ✦ 𝐂𝐡𝐚𝐭𝐔𝐧𝐢𝐭𝐲-𝐁𝐨𝐭 ✦ ︶・୨
꒷꒦ ‧₊ 🛡️ 𝐒 𝐓 𝐀 𝐅 𝐅 🛡️ ₊‧ ꒷꒦
୧・︶ : ︶ : ︶ : ︶ : ︶ : ︶・୨

✦ 👑 +39 339 185 2345 ~ mazzu |CEO|
✦ 👨‍💻 +212 783 587 782 ~ mazzu (bot)

👑 _Il team dietro 𝐂𝐡𝐚𝐭𝐔𝐧𝐢𝐭𝐲._
୧・︶ : ︶ ꒷꒦ ‧₊ ୧`.trim();

    // 1. Invia le schede contatto (rubrica)
    await conn.sendMessage(m.chat, {
        contacts: {
            displayName: 'Staff 𝐂𝐡𝐚𝐭𝐔𝐧𝐢𝐭𝐲',
            contacts: vcards
        },
        contextInfo: cuContext
    }, { quoted: m });

    // 2. Invia il testo stilizzato
    await conn.sendMessage(m.chat, {
        text: testo,
        contextInfo: cuContext
    });

};

handler.help = ['staff', 'owner', 'creatori'];
handler.tags = ['info'];
handler.command = /^(staff|owner|creatori|founder)$/i;

export default handler;