import './system/global.js';
import c from 'chalk';
import fs from 'fs';
import path from 'path';
import pino from 'pino';
import readline from 'readline';
import { makeWASocket, useMultiFileAuthState } from 'baileys';
import { handleCmd, ev } from './cmd/handle-runtime.js';
import { signal } from './cmd/interactive.js';
import { evConnect, handleSessionIssue } from './connect/evConnect.js';
import { autofarm } from './system/gamefunc.js';
import getMessageContent from './system/msg.js';
import { init, authFarm } from './system/db/data.js';
import { txtWlc, txtLft, mode, banned, bangc } from './system/sys.js';
import { getMetadata, replaceLid, saveLidCache, cleanMsg, filter, imgCache, _imgTmp, afk } from './system/function.js';

global.rl = readline.createInterface({ input: process.stdin, output: process.stdout });
global.q = (t) => new Promise((r) => rl.question(t, r));
global.lidCache = {};

const logLevel = pino({ level: 'silent' }),
      tempDir = path.join(dirname, '../temp');  

let xp,
    ft;

if (!imgCache.url) await _imgTmp();

fs.existsSync(tempDir) || fs.mkdirSync(tempDir, { recursive: true });
setInterval(() => console.clear(), 6e5);
init;

const startBot = async () => {
 
};


(async () => {
  try {
    await startBot();
  } catch (error) {
    console.error(c.red('Bot startup failed:'), error);
    process.exit(1);  
  }
})();
