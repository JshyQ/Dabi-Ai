import axios from 'axios'
import cheerio from 'cheerio'

export default function(ev) {
  ev.on({
    name: 'rule34video',
    cmd: ['r34v', 'rule34video'],
    tags: 'Nsfw Menu',
    desc: 'Random Rule34 video',
    prefix: true,

    run: async (xp, m, { chat }) => {
      try {
        await xp.sendMessage(chat.id, { react: { text: '⏳', key: m.key } })

        
        const mainPage = await axios.get('https://rule34video.com/')
        const $ = cheerio.load(mainPage.data)
        
      
        const videoLinks = []
        $('.post-preview a, .thumb a, [class*="video"] a').each((i, el) => {
          const href = $(el).attr('href')
          if (href && href.includes('/video/')) {
            videoLinks.push(href)
          }
        })

        if (videoLinks.length === 0) {
          return xp.sendMessage(chat.id, { 
            text: '❌ No videos available right now\nSite might be down' 
          }, { quoted: m })
        }

       
        const videoPageUrl = videoLinks[0]
        const videoPage = await axios.get(videoPageUrl)
        const $$ = cheerio.load(videoPage.data)

      
        const mp4Links = []
        
        
        $$('video source, video src').each((i, el) => {
          const src = $$(el).attr('src') || $$(el).attr('data-src')
          if (src && src.includes('.mp4')) mp4Links.push(src)
        })

        
        $$('[data-video], [data-mp4], [data-src*="mp4"]').each((i, el) => {
          const src = $$(el).attr('data-video') || $$(el).attr('data-mp4') || $$(el).attr('data-src')
          if (src && src.includes('.mp4')) mp4Links.push(src)
        })

        
        const scripts = videoPage.data.match(/https?:\/\/[^"]+\.mp4/gi) || []
        mp4Links.push(...scripts)

        const videoUrl = mp4Links[0]
        
        if (!videoUrl) {
          return xp.sendMessage(chat.id, { 
            text: `❌ Video not found\n📱 Try manually: ${videoPageUrl}` 
          }, { quoted: m })
        }

        await xp.sendMessage(chat.id, {
          video: { url: videoUrl },
          caption: `🎥 *Rule34 Video*\n🔗 ${videoUrl.substring(0, 50)}...\n⚠️ NSFW`
        }, { quoted: m })

        await xp.sendMessage(chat.id, { react: { text: '✅', key: m.key } })

      } catch (error) {
        console.error('R34V Error:', error.message)
        await xp.sendMessage(chat.id, { 
          text: `❌ Site down or blocked\n\n🔗 Alternative: rule34video.com` 
        }, { quoted: m })
      }
    }
  })
}
