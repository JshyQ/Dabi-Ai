let handler = async (m, { conn, usedPrefix, command } = {}) => {

  if (!m || !conn) return
  
  const wait = '⏳ Loading random waifu...'
  await m.reply(wait)
  
  try {
    let res = await fetch('https://api.waifu.pics/nsfw/waifu')
    
    if (!res.ok) return m.reply('❌ API down, coba lagi nanti!')
    
    let json = await res.json()
    
    if (!json.url) return m.reply('❌ No waifu found 😿')
    
    await conn.sendFile(m.chat, json.url, 'waifu.png', `
💕 *RANDOM NSFW WAIFU* 
🔥 waifu.pics/nsfw/waifu`, m)
    
    m.react('💖')
    
  } catch (e) {
    console.error('xwaifu error:', e)
    m.reply('❌ Gagal load waifu, coba lagi! 😿')
  }
}

handler.help = ['xwaifu']
handler.tags = ['nsfw', 'anime']
handler.command = ['xwaifu', 'waifu']
handler.premium = true

export default handler
