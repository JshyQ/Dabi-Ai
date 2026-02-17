diff --git a/cmd/command/menu.js b/cmd/command/menu.js
index ffe154d582195b13e1ccab65d640a7ada202c54c..ed6ecea6a7d6eeaf066439ff3fc995a0d6e364c4 100644
--- a/cmd/command/menu.js
+++ b/cmd/command/menu.js
@@ -1,42 +1,29 @@
-export default function(ev) {
+export default function (ev) {
   ev.on({
     name: 'menu',
     cmd: ['menu', 'help'],
     tags: 'Info Menu',
     desc: 'Show bot information',
     prefix: true,
     money: 0,
     run: async (xp, m, { chat, prefix }) => {
-      const allCommands = [];
-      
-      
+      const allCommands = []
       for (const plugin of ev.cmd || []) {
-        const commands = Array.isArray(plugin.cmd) ? plugin.cmd : [plugin.cmd];
-        allCommands.push(...commands);
+        const commands = Array.isArray(plugin.cmd) ? plugin.cmd : [plugin.cmd]
+        allCommands.push(...commands)
       }
 
-      const now = new Date();
-      const time = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
-      
+      const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
       const menuText = `┏───•❲ Dabi ❳
 │ • Bot Name: Dabi Chan Ai
-│ • Owner: Dein  
+│ • Owner: Dein
 │ • Waktu: ${time}
 │ • All Cmd: ${allCommands.length}
-│ • Total User: 1
 ┗────────────────··
 
-┏───•❲ Ai Menu ❳
-│ • autoai
-│ • cekkey
-│ • img2img
-│ • img2vid
-│ • resetbell
-│ • setlogic
-┗────────────────··
+Gunakan *${prefix}allmenu* untuk melihat semua menu.`
 
-┏───•❲ Download Menu ❳
-│ • fb
-│ • igdl
-│ • gitclone
-│ • 
+      await xp.sendMessage(chat.id, { text: menuText }, { quoted: m })
+    }
+  })
+}
