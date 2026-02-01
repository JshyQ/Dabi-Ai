import axios from 'axios'
import cheerio from 'cheerio'

export default function(ev) {
  ev.on({
    name: 'nhentai',
    cmd: ['nhentai', 'nh', 'doujin'],
    tags: 'Nsfw Menu',
    desc: 'Random nhentai doujin (all pages)',
    prefix: true,

    run: async (xp, m, { chat }) => {
      try {
        await xp.sendMessage(chat.id, { react: { text: '⏳', key: m.key } })

        
        const randomRes = await axios.get('https://nhentai.net/random/')
        const $ = cheerio.load(randomRes.data)
        
     
        const doujinUrl = $('#a-content > h1 > a').attr('href') || $('#gallery a').first().attr('href')
        const doujinId = doujinUrl.match(/g\/(\d+)/)?.[1]
        
        if (!doujinId) {
          throw new Error('Cannot find doujin ID')
        }

       
        const galleryUrl = `https://nhentai.net/g/${doujinId}/`
        const galleryRes = await axios.get(galleryUrl)
        const $$ = cheerio.load(galleryRes.data)
        
       
        const title = $$('#info h1').text().trim() || 'Random Doujin'
        const totalPages = parseInt($$('span#info > .info-after > .info').first().text()) || 20

        await xp.sendMessage(chat.id, { 
          text: `📚 *${title}*\n📄 Total: ${totalPages} pages\n⏳ Downloading...` 
        })

      
        const images = []
        for (let i = 1; i <= Math.min(totalPages, 30); i++) { // Max 30 pages
          const pageUrl = `https://nhentai.net/g/${doujinId}/t/${i}/`
          images.push(pageUrl)
        }

     
        await xp.sendMessage(chat.id, {
          image: images,
          caption: `📚 *${title}*\n\n🔗 nhentai.net/g/${doujinId}/\n⚠️ NSFW`
        }, { quoted: m })

        await xp.sendMessage(chat.id, { react: { text: '✅', key: m.key } })

      } catch (error) {
        console.error('Nhentai error:', error.message)
        await xp.sendMessage(chat.id, { 
          text: `❌ Nhentai failed\n\n💡 Try:\n• .hentai\n• .r34w` 
        }, { quoted: m })
      }
    }
  })
}
