import axios from 'axios'

export default function(ev) {
  ev.on({
    name: 'r34world',
    cmd: ['r34world', 'r34w', 'rule34world'],
    tags: 'Nsfw Menu',
    desc: 'Random Rule34.world video/image',
    prefix: true,

    run: async (xp, m, { chat, args }) => {
      try {
        await xp.sendMessage(chat.id, { react: { text: '⏳', key: m.key } })

      
        const tags = args.join(' ') || 'order:random rating:explicit'
        const apiUrl = `https://rule34.world/posts.json?tags=${encodeURIComponent(tags)}&limit=1`
        
        const res = await axios.get(apiUrl, {
          timeout: 10000,
          headers: { 'User-Agent': 'Mozilla/5.0' }
        })

        const post = res.data[0]
        if (!post?.file?.url) {
          return xp.sendMessage(chat.id, { 
            text: '❌ No content found\nTry: .r34w [tag]' 
          }, { quoted: m })
        }

        const isVideo = post.file.url.includes('.mp4') || post.file.url.includes('.webm')
        
        await xp.sendMessage(chat.id, {
          [isVideo ? 'video' : 'image']: { url: post.file.url },
          caption: `🎥 *Rule34.world*\n` +
                  `📝 Tags: ${post.tags?.join(', ')?.slice(0, 50)}...\n` +
                  `⭐ Score: ${post.score?.total || 0}\n` +
                  `🔗 ${post.file.url}\n\n⚠️ NSFW`
        }, { quoted: m })

        await xp.sendMessage(chat.id, { react: { text: '✅', key: m.key } })

      } catch (error) {
        console.error('R34World error:', error.message)
        await xp.sendMessage(chat.id, { 
          text: `❌ rule34.world failed\n\n` +
                `💡 Try:\n• .r34w\n• .r34w 1girl\n• .hentai` 
        }, { quoted: m })
      }
    }
  })
}
