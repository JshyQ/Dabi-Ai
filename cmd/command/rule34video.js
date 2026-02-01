import axios from 'axios'

export default function(ev) {
  ev.on({
    name: 'rule34video',
    cmd: ['rule34video', 'r34v', 'r34video'],
    tags: 'Nsfw Menu',
    desc: 'Random Rule34 video from rule34video.com',
    prefix: true,
    money: 500,
    exp: 0.4,

    run: async (xp, m, { chat, args }) => {
      try {
        await xp.sendMessage(chat.id, { react: { text: '⏳', key: m.key } })

       
        const res = await axios.get('http://rule34video.com/', {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        })

       
        const videoRegex = /<video[^>]+src=["']([^"']+\.mp4)["'][^>]*>/gi
        const videos = []
        let match
        
        while (match = videoRegex.exec(res.data)) {
          videos.push(match[1])
        }

        if (videos.length === 0) {
          return xp.sendMessage(chat.id, { 
            text: '❌ No videos found on rule34video.com' 
          }, { quoted: m })
        }

       
        const randomVideo = videos[Math.floor(Math.random() * videos.length)]

        await xp.sendMessage(chat.id, {
          video: { url: randomVideo },
          caption: `🎥 *Rule34 Video*\n\n🔗 ${randomVideo}\n\n⚠️ NSFW Content`
        }, { quoted: m })

        await xp.sendMessage(chat.id, { react: { text: '✅', key: m.key } })

      } catch (error) {
        console.error('Rule34Video error:', error.message)
        await xp.sendMessage(chat.id, { 
          text: '❌ Failed to fetch Rule34 video\nTry again later!' 
        }, { quoted: m })
      }
    }
  })
}
