import axios from 'axios'

export default function hentai(ev) {
  ev.on({
    name: 'hentai',
    cmd: ['hentai'],
    tags: 'Nsfw Menu',
    desc: 'Random hentai video',
    owner: false,
    prefix: true,
    money: 300,
    exp: 0.3,

    run: async (xp, m, { chat, cmd }) => {
      try {
        await xp.sendMessage(chat.id, { react: { text: '⏳', key: m.key } })

        const res = await axios.get('https://api.vreden.my.id/api/v1/random/hentai')
        const list = Array.isArray(res.data?.result) ? res.data.result : []

        if (list.length === 0) {
          await xp.sendMessage(chat.id, { react: { text: '', key: m.key } })
          return xp.sendMessage(chat.id, { text: '❌ Tidak ada video tersedia.' }, { quoted: m })
        }

        const chosen = list[Math.floor(Math.random() * list.length)]

        const caption = `*${chosen.title}*\n` +
          `Kategori: ${chosen.category}\n` +
          `Views: ${chosen.views_count}\n` +
          `Share: ${chosen.share_count}\n` +
          `[Link](${chosen.link})`

        await xp.sendMessage(chat.id, {
          video: { url: chosen.video_1 },
          caption: caption
        }, { quoted: m })

        await xp.sendMessage(chat.id, { react: { text: '✅', key: m.key } })

      } catch (err) {
        console.error('Hentai API Error:', err)
        await xp.sendMessage(chat.id, { text: '❌ Gagal mengambil video dari API.' }, { quoted: m })
      }
    }
  })
}
