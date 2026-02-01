import axios from 'axios';
import * as cheerio from 'cheerio';  

export default function(ev) {
  ev.on({
    name: 'rule34',
    cmd: ['rule34', 'rule', 'r34'],
    tags: 'Nsfw Menu',
    desc: 'Cari gambar random dari rule34 berdasarkan tag',
    prefix: !0,
    money: 1000,
    exp: 0.2,
    run: async (xp, m, { args, chat, cmd, prefix }) => {
      const q = args.join(' ');
      if (!q) 
        return xp.sendMessage(chat.id, { 
          text: `Contoh: ${prefix}${cmd} neko` 
        }, { quoted: m });

      try {
        await xp.sendMessage(chat.id, { react: { text: '⏳', key: m.key } });

        const { data } = await axios.get(
          `https://rule34.xxx/index.php?page=post&s=list&tags=${encodeURIComponent(q)}`,
          { headers: { 'User-Agent': 'Mozilla/5.0' } }
        );

        const $ = cheerio.load(data);           
        const posts = $('#post-list .thumb');
        
        if (!posts.length) 
          return xp.sendMessage(chat.id, { text: '❌ Tidak ditemukan' }, { quoted: m });

        const thumb = posts.eq(Math.floor(Math.random() * posts.length));
        const page = 'https://rule34.xxx' + thumb.find('a').attr('href');
        
        const det = await axios.get(page, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $$ = cheerio.load(det.data);      
        const image = $$('img#image').attr('src');
        
        await xp.sendMessage(chat.id, {
          image: { url: image },
          caption: `🔞 Rule34\nTag: ${q}\n${page}`
        }, { quoted: m });

      } catch (e) {
        err('rule34 error:', e);
        xp.sendMessage(chat.id, { text: `Error: ${e.message}` }, { quoted: m });
      }
    }
  });
}
