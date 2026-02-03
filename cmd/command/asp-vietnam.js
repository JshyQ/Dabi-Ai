let handler = async (m, { conn } = {}) => {
  
  if (!m || !conn) return
  
  try {
   
    await conn.sendMessage(m.chat, {
      react: { text: '🇻🇳', key: m.key }
    })

    const waitMsg = await m.reply('⏳ Loading Vietnam asupan...')
    
    const res = await fetch('https://api.siputzx.my.id/api/r/cecan/vietnam')
    if (!res.ok) throw new Error('API gagal')
    
    const buffer = Buffer.from(await res.arrayBuffer())
    
    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: `🇻🇳 *VIETNAM ASUPAN* 
Nih asupan Vietnam buat kamu! 🔥`,
    }, { quoted: m })

    waitMsg.delete() 
    
  } catch (err) {
    console.error('Vietnam plugin error:', err)
    m.reply('❌ Gagal load Vietnam asupan 😿\nCoba lagi nanti!')
  }
}

handler.command = ['vietnam']
handler.tags = ['premium', 'nsfw']
handler.help = ['vietnam']
handler.premium = true
handler.limit = false

export default handler
