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
      
      if (categoryArg && categorized[categoryArg]) {
       
        const catCommands = categorized[categoryArg];
        let menuText = `┏━『 *${categoryArg.toUpperCase()} MENU* 』\n┃\n`
        
        catCommands.slice(0, 15).forEach(cmd => {
          menuText += `┃◉ *${cmd.toUpperCase()}*\n`
        })
        
        if (catCommands.length > 15) {
          menuText += `┃\n┃◉ *+${catCommands.length - 15} LEBIH...*\n`
        }
        
        menuText += `┃\n┗━━━━━━━◧\n\n*Total: ${catCommands.length} commands*`
        return xp.sendMessage(chat.id, { text: menuText }, { quoted: m });
      }

     
      let mainMenu = `┏━『 *ALL COMMANDS* 』\n┃\n`
      
      const categories = {
        'Download Menu': '📥',
        'Ai Menu': '🤖', 
        'Tools Menu': '🛠️',
        'Info Menu': 'ℹ️',
        'Nsfw Menu': '🔞',
        'Fun Menu': '😄',
        'Game Menu': '🎮'
      }

      for (const [category, emoji] of Object.entries(categories)) {
        const cmds = categorized[category] || []
        if (cmds.length > 0) {
          mainMenu += `┠❯ *${emoji} ${category}* (${cmds.length} cmds)\n`
          cmds.slice(0, 4).forEach(cmd => {  
            mainMenu += `┃  ◉ *${cmd.toUpperCase()}*\n`
          })
          if (cmds.length > 4) {
            mainMenu += `┃  ...+${cmds.length - 4} more\n`
          }
          mainMenu += `┃\n`
        }
      }

      mainMenu += `┗━━━━━━━━━━━━━━━━\n\n`
      mainMenu += `*Contoh:*\n`
      mainMenu += `${prefix}menu fun\n`
      mainMenu += `${prefix}menu ai\n`
      mainMenu += `*Total:* ${allCommands.length} commands`
      
      await xp.sendMessage(chat.id, { text: mainMenu }, { quoted: m })
    }
  })
}
