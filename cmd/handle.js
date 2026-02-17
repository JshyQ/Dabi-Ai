diff --git a/cmd/handle.js b/cmd/handle.js
index c6ebe321aa08396c543d37394eb401172d323f95..02e170622fdd6e3b227404d0f35161cfe60e13c4 100644
--- a/cmd/handle.js
+++ b/cmd/handle.js
@@ -21,64 +21,96 @@ class CommandEmitter extends EventEmitter {
           if (def.owner && !own(m)) return
           await def.run(xp, m, extra)
         } catch (e) {
           err(c.redBright.bold(`Error ${def.name || c2}: `), e)
         }
       })
     }
     ;(this.cmd ??= []).push(def)
   }
 }
 
 const ev = new CommandEmitter()
 
 const unloadByFile = file => {
   if (!file || !ev.cmd) return
   const targets = ev.cmd.filter(x => x.file === file)
   if (!targets.length) return
   for (const t of targets) {
     const cmds = Array.isArray(t.cmd) ? t.cmd : [t.cmd]
     for (const c2 of cmds) ev.removeAllListeners(c2.toLowerCase())
   }
   ev.cmd = ev.cmd.filter(x => x.file !== file)
 }
 
 const loadFile = async (f, isReload = !0) => {
+  const originalOn = ev.on.bind(ev)
   try {
     const fp = p.join(dir, f),
           moduleUrl = `${fp}?update=${Date.now()}`
     isReload ? unloadByFile(f) : null
-    const originalOn = ev.on.bind(ev)
     ev.on = def => {
       if (typeof def === 'object' && def.cmd) def.file = f
       originalOn(def)
     }
     const mod = await import(moduleUrl).then(m => m.default || m)
-    typeof mod === "function" ? mod(ev) : null
-    ev.on = originalOn
+
+    if (typeof mod === "function" && mod.command) {
+      const parseCmd = input => {
+        if (!input) return []
+        if (Array.isArray(input)) return input.flatMap(parseCmd)
+        if (input instanceof RegExp) {
+          const src = input.source.replace(/^\^\(?/, '').replace(/\)\$.*$/, '')
+          return src.split('|').map(x => x.replace(/\\/g, '').trim()).filter(Boolean)
+        }
+        if (typeof input === 'string') return [input]
+        return []
+      }
+
+      const parsed = parseCmd(mod.command),
+            fallback = p.basename(f, '.js')
+
+      ev.on({
+        name: mod.name || fallback,
+        cmd: parsed.length ? parsed : [fallback],
+        owner: !!mod.owner,
+        prefix: true,
+        tags: Array.isArray(mod.tags) ? mod.tags.join(', ') : mod.tags,
+        run: async (xp, m, extra) => mod(m, {
+          ...extra,
+          conn: xp,
+          text: extra.args?.join(' ') || '',
+          usedPrefix: extra.prefix,
+          command: extra.cmd
+        })
+      })
+    } else if (typeof mod === "function") mod(ev)
+
   } catch (e) {
     err('error pada loadFile', e)
+  } finally {
+    ev.on = originalOn
   }
 }
 
 const loadAll = async () => {
   const files = fs.readdirSync(dir).filter(x => x.endsWith(".js"))
   for (const f of files) await loadFile(f, !0)
   const total = ev.cmd ? ev.cmd.length : 0
   log(c.greenBright.bgGrey.bold(`Berhasil memuat ${total} cmd`))
 }
 
 const watch = () => {
   const debounceTimers = {}
   try {
     fs.watch(dir, (_, f) => {
       if (!f?.endsWith(".js")) return
       clearTimeout(debounceTimers[f])
       debounceTimers[f] = setTimeout(() => {
         log(c.cyanBright.bold(`${f} diedit`))
         loadFile(f, !0)
       }, 3e2)
     })
   } catch {
     for (const f of fs.readdirSync(dir).filter(x => x.endsWith(".js"))) {
       fs.watchFile(p.join(dir, f), () => {
         log(c.cyanBright.bold(`${f} diedit`))
@@ -142,26 +174,26 @@ const handleCmd = async (m, xp, store) => {
         p.join(dirname, './db/bank.json'),
         JSON.stringify(bankDb, null, 2),
         'utf-8'
       )
 
       needSave = !0
     }
 
     needSave && await save.db()
 
     ev.emit(lowCmd, xp, m, {
       args,
       chat,
       text,
       cmd: lowCmd,
       prefix: pre,
       store
     })
   } catch (e) {
     err('error pada handleCmd', e)
   }
 }
 
 await loadAll()
 watch()
-export { handleCmd, ev }
\ No newline at end of file
+export { handleCmd, ev }
