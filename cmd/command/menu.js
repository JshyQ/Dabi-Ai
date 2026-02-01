export default function(ev) {
  ev.on({
    name: 'menu',
    cmd: ['menu', 'help'],
    tags: 'Info Menu',
    desc: 'List semua command tersedia',
    prefix: !0,
    money: 0,
    run: async (xp, m, { args, chat, prefix, cmd }) => {
      const allCommands = [];
      const categorized = {};
      
      for (const plugin of ev.cmd || []) {
        const commands = Array.isArray(plugin.cmd) ? plugin.cmd : [plugin.cmd];
        const tag = plugin.tags || 'Tools';
        
        for (const command of commands) {
          allCommands.push(command);
          (categorized[tag] ||= []).push(command);
        }
      }

      const categoryArg = args[0]?.toLowerCase();

      if (categoryArg && categorized[categoryArg]) {
        const catCommands = categorized[categoryArg];
        const menuText = `┏━『 *${categoryArg.toUpperCase()} MENU* 』
┃
${catCommands.slice(0, 15).map(c => `┃◉ *${c.toUpperCase()}*`).join('\n')}
${catCommands.length > 15 ? `\n┃\n┃◉ *+${catCommands.length - 15} LEBIH...*` : ''}
┃
┗━━━━━━━◧

*Gunakan:* ${prefix}${categoryArg} [command]`;
        
        return xp.sendMessage(chat.id, { text: menuText }, { quoted: m });
      }

      
      const mainMenu = `┏━『 *ᴍᴇɴᴜ ᴜᴛᴀᴍᴀ* 』
┃
┣⌬ *ᴅᴏᴡɴʟᴏᴀᴅ ᴍᴇɴᴜ* (${categorized['Download Menu']?.length || 0} cmd) 📥
┣⌬ *ᴀɪ ᴍᴇɴᴜ* (${categorized['Ai Menu']?.length || 0} cmd)        🤖
┣⌬ *ᴛᴏᴏʟs ᴍᴇɴᴜ* (${categorized['Tools Menu']?.length || 0} cmd)   🛠️
┣⌬ *ɪɴꜰᴏ ᴍᴇɴᴜ* (${categorized['Info Menu']?.length || 0} cmd)     ℹ️
┣⌬ *ɴꜰꜱᴡ ᴍᴇɴᴜ* (${categorized['Nsfw Menu']?.length || 0} cmd)    🔞
┣⌬ *ꜰᴜɴ ᴍᴇɴᴜ* (${categorized['Fun Menu']?.length || 0} cmd)      😄
┣⌬ *ɢᴀᴍᴇ ᴍᴇɴᴜ* (${categorized['Game Menu']?.length || 0} cmd)    🎮
┗━━━━━━━◧

*Contoh:*
${prefix}menu download
${prefix}menu ai  
${prefix}menu game

*Total Commands:* ${allCommands.length}`;

      await xp.sendMessage(chat.id, { text: mainMenu }, { quoted: m });
    }
  });
}
