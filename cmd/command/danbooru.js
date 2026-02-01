import fetch from 'node-fetch'

export default function danbooru(ev) {
  ev.on({
    name: 'danbooru',
    cmd: ['danbooru', 'db', 'animeimg', 'waifu'],
    tags: 'Nsfw Menu',  
    desc: 'Random anime image from Danbooru by tags',
    owner: false,
    prefix: true,
    money: 200,
    exp: 0.2,

    run: async (xp, m, { args, chat, cmd }) => {
      try {
        
        await xp.sendMessage(chat.id, { react: { text: '⏳', key: m.key } })

       
        const tags = args.join(' ').trim() || '1girl solo'
        
        
        const apiUrl = `https://danbooru.donmai.us/posts.json?tags=${encodeURIComponent(tags)}&limit=1&random=true`
        
        const response = await fetch(apiUrl)
        const data = await response.json()

        if (!data || data.length === 0) {
          return xp.sendMessage(chat.id, { 
            text: `❌ No images found for tags: *${tags}*\n\nTry: 1girl, cat, blonde_hair, maid, or combine them!`, 
            quoted: m 
          })
        }

        const post = data[0]
        const imageUrl = post.file_url || post.large_file_url || post.sample_url || post.preview_url
        
        if (!imageUrl) {
          return xp.sendMessage(chat.id, { 
            text: '❌ Image URL not available', 
            quoted: m 
          })
        }

        
        let caption = `🎨 *Danbooru Image*\n\n`
        caption += `📝 *Tags:* ${post.tag_string_artist ? post.tag_string_artist + ' - ' : ''}${tags}\n`
        caption += `⭐ *Score:* ${post.score?.total || 0}\n`
        caption += `👤 *Artist:* ${post.tag_string_artist || 'Anonymous'}\n`
        if (post.tag_string_character) caption += `🎭 *Character:* ${post.tag_string_character}\n`
        
      
        const rating = post.rating || 's'
        if (rating === 'e') caption += `🔞 *Rating:* Explicit\n`
        else if (rating === 'q') caption += `⚠️ *Rating:* Questionable\n`

        caption += `\n🔗 ${imageUrl}`

        
        await xp.sendMessage(chat.id, {
          image: { url: imageUrl },
          caption: caption
        }, { quoted: m })

      } catch (e) {
        console.error('Danbooru error:', e)
        await xp.sendMessage(chat.id, { 
          text: '❌ Failed to fetch image. Try different tags!', 
          quoted: m 
        })
      }
    }
  })
}
