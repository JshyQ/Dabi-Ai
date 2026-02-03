let handler = async (m, { conn, usedPrefix, command } = {}) => {
 
  if (!m || !conn) return
  
  const wait = '⏳ Loading random neko...'
  m.reply(wait)
  
  try {
    let res = await fetch('https://api.waifu.pics/nsfw/neko', { 
      timeout: 10000 
    })
    
    if (!res.ok) return m.reply('❌ API error, coba lagi!')
    
    let json = await res.json()
    
    if (!json.url) return m.reply('❌ No image found')
    
    await conn.sendFile(m.chat, json.url, 'neko.png', `
🐱 *RANDOM NEKO* 
💫 waifu.pics/nsfw/neko`, m)
    
    m.react('😻')
    
  } catch (e) {
    console.error('xneko error:', e)
    m.reply('❌ Failed to load neko 😿')
  }
}

handler.help = ['xneko']
handler.tags = ['nsfw', 'anime']
handler.command = ['xneko', 'neko']
handler.premium = true

export default handler
