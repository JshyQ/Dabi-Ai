let handler = async (m, { conn, command } = {}) => {
  
  if (!m || !conn) return
  
  try {
    const waitMsg = await m.reply('⏳ Loading Thailand asupan...')
    
    let response = await fetch('https://api.tioprm.eu.org/thailand')
    if (!response.ok) throw new Error('API gagal')
    
    const buffer = Buffer.from(await response.arrayBuffer())
    
    await conn.sendFile(m.chat, buffer, 'thailand.jpg', `
🇹🇭 *THAILAND ASUPAN* 
_Nih Kak_ 🔥`, m)
    
    waitMsg.delete() 
    
  } catch (error) {
    console.error('Thailand plugin error:', error)
    m.reply('❌ Gagal load Thailand asupan!\nCoba lagi nanti 😿')
  }
}

handler.command = /^(thailand)$/i
handler.tags = ['asupan', 'premium', 'nsfw']
handler.help = ['thailand']
handler.premium = true
handler.limit = false

export default handler
