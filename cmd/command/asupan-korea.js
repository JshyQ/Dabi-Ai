let handler = async (m, { conn } = {}) => {
 
  if (!m || !conn) return
  
  try {
    const waitMsg = await m.reply('⏳ Loading Korean asupan...')
    
    let res = await fetch('https://raw.githubusercontent.com/ArifzynXD/database/master/asupan/korea.json')
    if (!res.ok) throw new Error('API gagal')
    
    let json = await res.json()
    
    if (!json || !Array.isArray(json) || json.length === 0) {
      throw new Error('No Korean asupan available')
    }
    
    const randomIndex = Math.floor(Math.random() * json.length)
    const randomURL = json[randomIndex].url
    
    if (!randomURL) throw new Error('Invalid URL')
    
    await conn.sendFile(m.chat, randomURL, 'korea.jpg', `
🇰🇷 *KOREAN ASUPAN* 
_Nih Kak_ 🔥`, m)
    
    waitMsg.delete() 
    
  } catch (error) {
    console.error('Korea plugin error:', error)
    m.reply('❌ Gagal load Korean asupan!\nCoba lagi nanti 😿')
  }
}

handler.tags = ['asupan', 'premium', 'nsfw']
handler.help = ['korea']
handler.command = ['korea']
handler.premium = true

export default handler
