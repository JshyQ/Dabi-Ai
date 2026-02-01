export default function(ev) {
  ev.on({
    name: 'menu',
    cmd: ['menu', 'help'],
    tags: 'Info Menu',
    desc: 'Show bot information',
    prefix: true,
    money: 0,
    run: async (xp, m, { chat, prefix }) => {
      const allCommands = [];
      
      
      for (const plugin of ev.cmd || []) {
        const commands = Array.isArray(plugin.cmd) ? plugin.cmd : [plugin.cmd];
        allCommands.push(...commands);
      }

      const now = new Date();
      const time = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      
      const menuText = `┏───•❲ Dabi ❳
│ • Bot Name: Dabi Chan Ai
│ • Owner: Dein  
│ • Waktu: ${time}
│ • All Cmd: ${allCommands.length}
│ • Total User: 1
┗────────────────··

┏───•❲ Ai Menu ❳
│ • autoai
│ • cekkey
│ • img2img
│ • img2vid
│ • resetbell
│ • setlogic
┗────────────────··

┏───•❲ Download Menu ❳
│ • fb
│ • igdl
│ • gitclone
│ • 
