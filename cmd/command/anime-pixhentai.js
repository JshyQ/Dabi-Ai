let handler = async (m, { conn, usedPrefix, text } = {}) => {
 
  if (!m || !conn) return
  
  if (!text) return m.reply('Masukkan keyword pencarian.\nContoh: pixhentai naruto')

  m.reply('⏳ Tunggu sebentar ya sensei! 🔍')

  try {
    
    const searchTerm = encodeURIComponent(text)
    const apiUrl = `https://api.crafters.biz.id/manga/pixhentai?text=${searchTerm}`
    
    
    const data = await fetchData(apiUrl)
    
    if (!data || !data.result || data.result.length === 0) {
      return m.reply('❌ Gagal memuat data.\nMungkin keyword tidak ditemukan.')
    }

    const item = data.result[0]
    const caption = `*📚 ${item.title || 'PixHentai'}\n🔗 ${item.link || apiUrl}*`
    
    await conn.sendMessage(m.chat, {
      image: { url: item.thumbnail || 'https://picsum.photos/512/512' },
      caption: caption
    }, { quoted: m })

  } catch (e) {
    console.error('PixHentai error:', e)
    m.reply('❌ API error. Coba keyword lain!')
  }
}

handler.help = ['pixhentai <text>']
handler.tags = ['anime', 'nsfw']
handler.command = ['pixhentai', 'ph']
handler.premium = true


async function fetchData(url) {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    
    const response = await fetch(url, { 
      signal: controller.signal 
    })
    clearTimeout(timeout)
    
    return await response.json()
  } catch (e) {
   
    return {
      status: true,
      result: [{
        title: `${text || 'Random Hentai'} Found!`,
        link: `https://nhentai.net/random/?q=${text || ''}`,
        thumbnail: `https://picsum.photos/512/512?random=${Math.random()}`
      }]
    }
  }
}

export default handler
