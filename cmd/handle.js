import c from "chalk";
import fs from "fs";
import p from "path";
import EventEmitter from "events";
import getMessageContent from '../system/msg.js';
import { authUser, role } from '../system/db/data.js';
import { own } from '../system/helper.js';
import { cekSpam, _tax } from '../system/function.js';

const dir = p.join(dirname, "../cmd/command");  

class CommandEmitter extends EventEmitter {
 
  on(def) {
    if (typeof def !== "object" || !def.cmd) return super.on(def);
    const cmds = Array.isArray(def.cmd) ? def.cmd : [def.cmd];
    for (const c2 of cmds) {
      const low = c2.toLowerCase();
      this.on(low, async (xp, m, extra) => {
        try {
          if (def.prefix && !extra.prefix) return;
          if (def.owner && !own(m)) return;
          await def.run(xp, m, extra);
        } catch (e) {
          err(c.redBright.bold(`Error ${def.name || c2}: `), e);
        }
      });
    }
    (this.cmd ??= []).push(def);
  }
}

const ev = new CommandEmitter();


const unloadByFile = file => {
  if (!file || !ev.cmd) return;
  const targets = ev.cmd.filter(x => x.file === file);
  if (!targets.length) return;
  for (const t of targets) {
    const cmds = Array.isArray(t.cmd) ? t.cmd : [t.cmd];
    for (const c2 of cmds) ev.removeAllListeners(c2.toLowerCase());
  }
  ev.cmd = ev.cmd.filter(x => x.file !== file);
};


const loadFile = async (f, isReload = true) => {
  const originalOn = ev.on.bind(ev);
  try {
    const fp = p.join(dir, f),
          moduleUrl = `${fp}?update=${Date.now()}`;
    if (isReload) unloadByFile(f);
    ev.on = def => {
      if (typeof def === 'object' && def.cmd) def.file = f;
      originalOn(def);
    };
    const mod = await import(moduleUrl).then(m => m.default || m);
    if (typeof mod === "function" && mod.command) {
      const parseCmd = input => {
        if (!input) return [];
        if (Array.isArray(input)) return input.flatMap(parseCmd);
        if (input instanceof RegExp) {
          const src = input.source.replace(/^\^\(?/, '').replace(/\)\$.*$/, '');
          return src.split('|').map(x => x.replace(/\\/g, '').trim()).filter(Boolean);
        }
        if (typeof input === 'string') return [input];
        return [];
      };
      const parsed = parseCmd(mod.command),
            fallback = p.basename(f, '.js');
      ev.on({
        name: mod.name || fallback,
        cmd: parsed.length ? parsed : [fallback],
        owner: !!mod.owner,
        prefix: true,
        tags: Array.isArray(mod.tags) ? mod.tags.join(', ') : mod.tags,
        run: async (xp, m, extra) => mod(m, {
          ...extra,
          conn: xp,
          text: extra.args?.join(' ') || '',
          usedPrefix: extra.prefix,
          command: extra.cmd
        })
      });
    } else if (typeof mod === "function") mod(ev);
  } catch (e) {
    err('error pada loadFile', e);
  } finally {
    ev.on = originalOn;
  }
};


const loadAll = async () => {
  const files = fs.readdirSync(dir).filter(x => x.endsWith(".js"));
  for (const f of files) await loadFile(f, true);
  const total = ev.cmd ? ev.cmd.length : 0;
  log(c.greenBright.bgGrey.bold(`Berhasil memuat ${total} cmd`));
};


const watch = () => {
  const debounceTimers = {};
  try {
    fs.watch(dir, (_, f) => {
      if (!f?.endsWith(".js")) return;
      clearTimeout(debounceTimers[f]);
      debounceTimers[f] = setTimeout(() => {
        log(c.cyanBright.bold(`${f} diedit`));
        loadFile(f, true);
      }, 300);
    });
  } catch {
    for (const f of fs.readdirSync(dir).filter(x => x.endsWith(".js"))) {
      fs.watchFile(p.join(dir, f), () => {
        log(c.cyanBright.bold(`${f} diedit`));
        loadFile(f, true);
      });
    }
  }
};


const handleCmd = async (m, xp, store) => {
  try {
    const { text } = getMessageContent(m);
    if (!text) return;

    const bankDb = JSON.parse(fs.readFileSync(p.join(dirname, './db/bank.json'), 'utf-8')),
          pfx = [].concat(global.prefix),
          pre = pfx.find(p => text.startsWith(p)) || '',
          cmdText = pre ? text.slice(pre.length).trim() : text.trim(),
          [cmd, ...args] = cmdText.split(/\s+/),
          lowCmd = cmd?.toLowerCase();
    if (!lowCmd) return;

    const chat = global.chat(m),
          sender = chat.sender?.replace(/@s\.whatsapp\.net$/, ''),
          userDb = Object.values(db().key).find(u => u.jid === chat.sender),
          ownerNum = [].concat(global.ownerNumber).map(n => n?.replace(/[^0-9]/g, '')),
          eventData = ev.cmd?.find(e =>
            e.name?.toLowerCase() === lowCmd ||
            e.cmd?.some(c => c.toLowerCase() === lowCmd)
          );

    if (!eventData || ((eventData.prefix ?? true) ? !pre : pre)) return;

    await authUser(m);

    if (!userDb ? (xp.sendMessage(chat.id, { text: 'ulangi' }, { quoted: m }), true) : ((!global.public || eventData.owner) && !ownerNum.includes(sender)) ? true : await cekSpam(xp, m)) return;

    const exp = eventData.exp ?? 0.1,
          expInt = Math.round(exp * 10);

    let needSave = false,
        cost = eventData.money;

    if (userDb) {
      userDb.cmd = (userDb.cmd || 0) + 1;
      userDb.exp = (userDb.exp || 0) + expInt;
      role();
      needSave = true;
    }

    if (!cost || cost <= 0) cost = await _tax(xp, m);

    if (cost > 0) {
      if ((userDb.moneyDb?.money || 0) < cost)
        return xp.sendMessage(chat.id, { text: `uang kamu tersisa Rp ${userDb.moneyDb.money.toLocaleString('id-ID')}\n` + `butuh: Rp ${cost.toLocaleString('id-ID')}` }, { quoted: m });

      userDb.moneyDb.money -= cost;
      bankDb.key.saldo += cost;

      fs.writeFileSync(
        p.join(dirname, './db/bank.json'),
        JSON.stringify(bankDb, null, 2),
        'utf-8'
      );

      needSave = true;
    }

    if (needSave) await save.db();

    ev.emit(lowCmd, xp, m, {
      args,
      chat,
      text,
      cmd: lowCmd,
      prefix: pre,
      store
    });
  } catch (e) {
    err('error pada handleCmd', e);
  }
};

await loadAll();
watch();

export { handleCmd, ev };
