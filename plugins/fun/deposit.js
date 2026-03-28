let handler = async (m, { args }) => {
   let user = global.db.data.users[m.sender];

   // Inizializza i valori di default se non esistono
   if (typeof user.bank !== 'number') user.bank = 0;
   if (typeof user.limit !== 'number') user.limit = 0;

   if (!args[0]) return m.reply('🚩 ɪɴsᴇʀɪsᴄɪ ʟᴀ ǫᴜᴀɴᴛɪᴛᴀ ᴅᴏᴡɴ.');
   if (args[0] < 1) return m.reply('🚩 ғʀᴀᴛᴇ sᴇɪ sᴛᴜᴘɪᴅᴏ? ᴍᴇᴛᴛɪ ᴜɴᴀ ǫᴜᴀɴᴛɪᴛᴀ ɢɪᴜsᴛᴀ!!.');

   if (args[0] === 'all') {
      let count = parseInt(user.limit);
      if (count <= 0) return m.reply('🚩 ᴘᴏᴠᴇʀᴏ ɴᴏɴ ʜᴀɪ ᴀʙʙᴀsᴛᴀɴᴢᴀ sᴏʟᴅᴋi.');
      user.limit -= count;
      user.bank += count;
      await m.reply(`🚩 ʙʀᴀᴠᴏ ʜᴀɪ ᴅᴇᴘᴏsɪsᴛᴀᴛᴏ ${count} 💶 ᴜɴɪᴛʏᴄᴏɪɴ* ɴᴇʟʟᴀ ᴛᴜᴀ ʙᴀɴᴄᴀ.`);
      return;
   }

   if (isNaN(args[0])) return m.reply('🚩 ʟᴀ ǫᴜᴀɴᴛɪᴛᴀ ᴅᴇᴠᴇ ᴇssᴇʀᴇ ᴜɴ ᴄᴀᴢᴢᴏ ᴅɪ ɴᴜᴍᴇʀ.');
   let count = parseInt(args[0]);

   if (user.limit <= 0) return m.reply('🚩 ɴᴏɴ ʜᴀɪ 💶 ᴜɴɪᴛʏᴄᴏɪɴ ɴᴇʟ ᴘᴏʀᴛᴀғᴏɢʟɪᴏ ᴅᴏᴡɴ.');
   if (user.limit < count) return m.reply(`🚩 ʜᴀɪ sᴏʟᴏ ${user.limit} 💶 ᴜɴɪᴛʏᴄᴏɪɴs ɴᴇʟ ᴘᴏʀᴛᴀғᴏɢʟɪᴏ ʙʀᴜᴛᴛʟ ɢᴀʏ`);

   user.limit -= count;
   user.bank += count;
   await m.reply(`🚩 ᴏʜʜ ғɪɴᴀʟᴍᴇɴᴛᴇ sᴏʟᴅɪ, ʜᴀɪ ᴅᴇᴘᴏsɪsᴛᴀᴛᴏ ${count} 💶 ᴜɴɪᴛʏᴄᴏɪɴs ɪɴ ʙᴀɴᴄᴀ.`);
};

handler.help = ['deposit'];
handler.tags = ['rpg'];
handler.command = ['deposita', 'depositar', 'dep', 'd'];
handler.register = true;
export default handler;