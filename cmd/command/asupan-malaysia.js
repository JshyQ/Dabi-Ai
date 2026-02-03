let handler = async (m, { conn } = {}) => {
  
  if (!m || !conn) return
  
  try {
    const waitMsg = await m.reply('⏳ Loading Malaysia asupan...')
    
    let response = await fetch('https://api.tioprm.eu.org/malaysia')
    if (!response.ok) throw new Error('API gagal')
    
    const buffer = Buffer.from(await response.arrayBuffer())
    
    await conn.sendFile(m.chat, buffer, 'malaysia.jpg', `
🇲🇾 *MALAYSIA ASUPAN* 
_Nih Kak_ 🔥`, m)
    
    waitMsg.delete() 
    
  } catch (error) {
    console.error('Malaysia plugin error:', error)
    m.reply('❌ Gagal load Malaysia asupan!\nCoba lagi nanti 😿')
  }
}

handler.command = /^(malaysia)$/i
handler.tags = ['asupan', 'premium', 'nsfw']
handler.help = ['malaysia']
handler.premium = true
handler.limit = false

export default handler
