export default function(ev) {
  
  ev.on({
    name: 'menu',
    cmd: ['menu', 'help'],
    tags: 'Tools',
    desc: 'Tampilkan menu utama',
    run: async (xp, m, { args, chat, prefix }) => {
      const category = args[0]?.toLowerCase();
      
      if (category === 'allmenu') {
        return showAllMenu(xp, m, chat);
      }
      
      if (category && menuCategories[category]) {
        return showCategoryMenu(xp, m, chat, category);
      }
      
      showMainMenu(xp, m, chat);
    }
  });
  
  
  Object.keys(menuCategories).forEach(cat => {
    ev.on({
      name: `${cat}menu`,
      cmd: [`menu ${cat}`, cat],
      tags: 'Menu',
      desc: `Menu ${cat}`,
      run: async (xp, m, { chat }) => {
        showCategoryMenu(xp, m, chat, cat);
      }
    });
  });
}


const menuCategories = {
  admin: ['Admin tools', 'ban', 'kick', 'promote'],
  ai: ['AI Chat', 'ask', 'gpt'],
  anime: ['Anime quotes', 'waifu', 'husbando'],
  berita: ['News', 'hotnews'],
  download: ['TikTok', 'rule34', 'ig', 'yt'],
  editor: ['Image editor', 'sticker', 'removebg'],
  games: ['TicTacToe', 'suit', 'tebak'],
  group: ['Group settings', 'antilink', 'welcome'],
  information: ['Profile', 'owner', 'botinfo'],
  islami: ['Jadwal sholat', 'quran', 'doa'],
  'kerang ajaib': ['Kerang', 'apa', 'kapan'],
  maker: ['Logo maker', 'textpro', 'photooxy'],
  more: ['Random', 'quotes', 'meme'],
  owner: ['Owner menu', 'broadcast', 'clear'],
  panel: ['Dashboard', 'stats'],
  pushkontak: ['Push contact', 'getcontact'],
  random: ['Random text', 'quotes', 'fakta'],
  store: ['Store', 'shop', 'buy'],
  textpro: ['Text effects', 'neon', 'glitch'],
  tools: ['Tools', 'calc', 'weather', 'translate']
};

const showMainMenu = async (xp, m, chat) => {
  const menuText = `┏━❍『 *ᴍᴇɴᴜ ᴜᴛᴀᴍᴀ* 』❍
┃
${Object.entries(menuCategories).map(([cat, info], i) => 
  `┣⌬ *${cat.replace(/\b\w/g, l => l.toUpperCase())}*`
).join('\n')}
┗━━━━━━━◧

*ᴋᴇᴛɪᴋ ɴᴀᴍᴀ ᴋᴀᴛᴇɢᴏʀɪ ᴜɴᴛᴜᴋ ᴍᴇʟɪʜᴀᴛ ɪꜱɪɴʏᴀ.*
*ᴄᴏɴᴛᴏʜ:* ${m.prefix}menu ai *ᴀᴛᴀᴜ* ${m.prefix}allmenu *ᴜɴᴛᴜᴋ ꜱᴇᴍᴜᴀ ᴍᴇɴᴜ*`;
  
  await xp.sendMessage(chat.id, { 
    text: menuText 
  }, { quoted: m });
};

const showCategoryMenu = async (xp, m, chat, category) => {
  const [title, commands] = menuCategories[category];
  const menuText = `┏━❍『 *${category.toUpperCase()} MENU* 』❍
┃
${commands.map(cmd => `┃◉ *${cmd.toUpperCase()}*`).join('\n')}
┃
┗━━━━━━━◧

*Ketik: ${m.prefix}${category} [command] untuk menggunakan*`;
  
  await xp.sendMessage(chat.id, { 
    text: menuText 
  }, { quoted: m });
};

const showAllMenu = async (xp, m, chat) => {
  const allCommands = Object.values(menuCategories).flatMap(([, cmds]) => cmds);
  const menuText = `┏━❍『 *ALL COMMANDS* 』❍
┃ *Total: ${allCommands.length} commands*
┃
${allCommands.map((cmd, i) => 
  `┃${i % 10 === 0 ? '\n' : ''}◉ *${cmd.toUpperCase()}*`
).join('\n')}
┗━━━━━━━◧`;
  
  await xp.sendMessage(chat.id, { 
    text: menuText 
  }, { quoted: m });
};
