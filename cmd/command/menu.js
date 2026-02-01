export default function(ev) {
  ev.on({
    name: 'allcommands',
    cmd: ['menu'],  
    tags: 'Info Menu',
    desc: 'Show ALL available commands',
    prefix: true,
    money: 0,
    run: async (xp, m, { chat, prefix }) => {
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

      
      let fullMenu = `┏━「 *ALL COMMANDS* 」\n┃\n`
      
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
          fullMenu += `┠❯ *${emoji} ${category}* (${cmds.length} cmds)\n`
          cmds.slice(0, 8).forEach(cmd => {
            fullMenu += `┃  ◉ *${cmd.toUpperCase()}*\n`
          })
          if (cmds.length > 8) {
            fullMenu += `┃  ◉ *+${cmds.length - 8} MORE...*\n`
          }
          fullMenu += `┃\n`
        }
      }

      fullMenu += `┗━━━━━━━━━━━━━━━━\n\n`
      fullMenu += `*Total:* ${allCommands.length} commands\n`
      fullMenu += `*Prefix:* \`${prefix}\``
      fullMenu += `\n*Type:* \`${prefix}[command] [args]\``

      await xp.sendMessage(chat.id, { text: fullMenu }, { quoted: m })
    }
  })
}
