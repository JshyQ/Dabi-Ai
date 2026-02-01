import fs from "fs";
import path from "path";

export default function(ev) {
  ev.on({
    name: "menu",
    cmd: ["menu", "help", "menuall"],
    tags: "Info Menu",
    desc: "Menampilkan menu lengkap bot",
    prefix: !0,
    money: 0,
    run: async (xp, m, { args, chat, prefix, cmd }) => {
      const category = args.join(" ").toLowerCase();
      
      
      const plugins = ev.cmd || [];
      const categorized = {};
      
      for (const plugin of plugins) {
        const tag = plugin.tags || "Other Menu";
        (categorized[tag] ||= []).push(...(Array.isArray(plugin.cmd) ? plugin.cmd : [plugin.cmd]));
      }

      const categories = Object.keys(categorized).sort();

      if (category === "all" || cmd.includes("menuall")) {
        return showAllMenu(xp, m, chat, categorized, prefix);
      }
      
      if (category && categories.some(c => c.toLowerCase().includes(category))) {
        const matched = categories.find(c => c.toLowerCase().includes(category));
        return showCategoryMenu(xp, m, chat, matched, categorized[matched], prefix);
      }

      showMainMenu(xp, m, chat, categories, prefix);
    }
  });
}


const showMainMenu = async (xp, m, chat, categories, prefix) => {
  const totalCmd = ev.cmd?.length || 0;
  
  const menuText = `┏━『 *ᴍᴇɴᴜ ᴜᴛᴀᴍᴀ* 』
┃
┣⌬ *ᴀᴅᴍɪɴ*
┣⌬ *ᴀɪ*
┣⌬ *ᴀɴɪᴍᴇ*
┣⌬ *ʙᴇʀɪᴛᴀ*
┣⌬ *ᴅᴏᴡɴʟᴏᴀᴅ*
┣⌬ *ᴇᴅɪᴛᴏʀ*
┣⌬ *ɢᴀᴍᴇꜱ*
┣⌬ *ɢʀᴏᴜᴘ*
┣⌬ *ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ*
┣⌬ *ɪꜱʟᴀᴍɪ*
┣⌬ *ᴋᴇʀᴀɴɢ ᴀᴊᴀɪʙ*
┣⌬ *ᴍᴀᴋᴇʀ*
┣⌬ *ᴍᴏʀᴇ*
┣⌬ *ᴏᴡɴᴇʀ*
┣⌬ *ᴘᴀɴᴇʟ*
┣⌬ *ᴘᴜꜱʜᴋᴏɴᴛᴀᴋ*
┣⌬ *ʀᴀɴᴅᴏᴍ*
┣⌬ *ꜱᴛᴏʀᴇ*
┣⌬ *ᴛᴇxᴛᴘʀᴏ*
┣⌬ *ᴛᴏᴏʟꜱ*
┗━━━━━━━◧

*ᴋᴇᴛɪᴋ ɴᴀᴍᴀ ᴋᴀᴛᴇɢᴏʀɪ ᴜɴᴛᴜᴋ ᴍᴇʟɪʜᴀᴛ ɪꜱɪɴʏᴀ.*
*ᴄᴏɴᴛᴏʜ:* ${prefix}menu ai *ᴀᴛᴀᴜ* ${prefix}menu all *ᴜɴᴛᴜᴋ ꜱᴇᴍᴜᴀ ᴍᴇɴᴜ*`;

  await xp.sendMessage(chat.id, { text: menuText }, { quoted: m });
};


const showCategoryMenu = async (xp, m, chat, category, commands, prefix) => {
  const menuText = `┏━『 *${category.toUpperCase()} MENU* 』
┃
${commands.slice(0, 20).map(cmd => `┃◉ *${cmd.toUpperCase()}*`).join('\n')}
${commands.length > 20 ? `\n┃\n┃◉ *+${commands.length - 20} LEBIH...*` : ''}
┃
┗━━━━━━━◧

*Ketik:* ${prefix}${category} [command] *untuk menggunakan*`;

  await xp.sendMessage(chat.id, { text: menuText }, { quoted: m });
};

// All commands list
const showAllMenu = async (xp, m, chat, categorized, prefix) => {
  let allCmds = [];
  for (const [cat, cmds] of Object.entries(categorized)) {
    allCmds.push(...cmds.slice(0, 5)); // 5 per category
  }
  
  const menuText = `┏━『 *ALL COMMANDS* 』
┃ *Total:* ${allCmds.length}+ *commands*
┃
${allCmds.map((cmd, i) => 
  `┃${i%5===0&&i>0?'\n┃':''}◉ *${cmd.toUpperCase()}*`
).join('\n')}
┃
┗━━━━━━━◧

*Type:* ${prefix}[command] *to use*`;

  await xp.sendMessage(chat.id, { text: menuText }, { quoted: m });
};
