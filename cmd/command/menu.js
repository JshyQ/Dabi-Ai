export default function(ev) {
  ev.on({
    name: 'menu',
    cmd: ['menu'],  
    tags: 'Info Menu',
    desc: 'Show all commands or specific category',
    prefix: true,
    money: 0,
    run: async (xp, m, { args, chat, prefix }) => {
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
      console.log('=== MENU DEBUG ===');
      console.log('User typed:', args.join(' '));
      console.log('categoryArg:', categoryArg);
      console.log('Available categories:', Object.keys(categorized));
      console.log('==================');

    
      const exactMatch = Object.keys(categorized).find(cat => 
        cat.toLowerCase() === categoryArg
      );
      
      if (exactMatch) {
     
        const catCommands = categorized[exactMatch];
        let menuText = `┏━『 *${exactMatch.toUpperCase()} MENU* 』\n┃\n`;
        
        catCommands.slice(0, 15).forEach(cmd => {
          menuText += `┃◉ *${cmd.toUpperCase()}*\n`;
        });
        
        menuText += `┃\n┗━━━━━━━◧\n\n*Total: ${catCommands.length} commands*`;
        return xp.sendMessage(chat.id, { text: menuText }, { quoted: m });
      }

     
      let mainMenu = `┏━『 *ALL CATEGORIES* 』\n┃\n`;
      
      const categoryDisplay = {
        'Download Menu': '📥 Download',
        'Ai Menu': '🤖 AI', 
        'Tools Menu': '🛠️ Tools',
        'Info Menu': 'ℹ️ Info',
        'Nsfw Menu': '🔞 NSFW',
        'Fun Menu': '😄 Fun',
        'Game Menu': '🎮 Game'
      };

      for (const [fullTag, displayName] of Object.entries(categoryDisplay)) {
        const cmds = categorized[fullTag] || [];
        if (cmds.length > 0) {
          mainMenu += `┠❯ *${displayName}* (${cmds.length})\n`;
          mainMenu += `┃  📝 Type: \`${prefix}menu ${fullTag.toLowerCase().replace(/ menu$/, '')}\`\n`;
          cmds.slice(0, 2).forEach(cmd => {
            mainMenu += `┃  ◉ *${cmd.toUpperCase()}*\n`;
          });
          mainMenu += `┃\n`;
        }
      }

      mainMenu += `┗━━━━━━━━━━━━━━━━\n\n`;
      mainMenu += `*Total:* ${allCommands.length} commands\n`;
      mainMenu += `*Examples:*\n\`${prefix}menu "Download Menu"\n${prefix}menu "Fun Menu"\``;
      
      await xp.sendMessage(chat.id, { text: mainMenu }, { quoted: m });
    }
  });
}
