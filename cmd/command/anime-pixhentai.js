import fetch from 'node-fetch'

let handler = async (m, { 
conn, usedPrefix, text }) => {

  if (!text) return m.reply('Masukkan keyword pencarian.\nContoh: pixhentai naruto');

  m.reply('Tunggu sebentar ya sensei!');

  try {
    const res = await fetch(`https://api.crafters.biz.id/manga/pixhentai?text=${encodeURIComponent(text)}`);
    const data = await res.json();

    if (!data.status || !data.result || data.result.length === 0) {
      console.log('[PixHentai DEBUG]', data);
      return m.reply('Gagal memuat data.\nMungkin keyword tidak ditemukan atau API sedang bermasalah.');
    }

    const item = data.result[0]; // ambil item pertama

    let hasil = `*Judul:* ${item.title}\n*Link:* ${item.link}`;

    await conn.sendMessage(m.chat, {
      image: { url: item.thumbnail },
      caption: hasil
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('Terjadi kesalahan saat mengakses API.');
  }
}
handler.help = ['pixhentai <text>']
handler.tags = ['anime']
handler.command = ['pixhentai']
handler.premium = true

export default handler;;