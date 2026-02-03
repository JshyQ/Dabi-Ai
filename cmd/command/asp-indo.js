let handler = async (m, { conn } = {}) => {
  
  if (!m || !conn) return
  
  try {
    
    await conn.sendMessage(m.chat, {
      react: { text: '🇮🇩', key: m.key }
    })

    const waitMsg = await m.reply('⏳ Loading cecan Indonesia...')
    
    const res = await fetch('https://api.siputzx.my.id/api/r/cecan/indonesia')
    if (!res.ok) throw new Error('API failed')
    
    const buffer = Buffer.from(await res.arrayBuffer())
    
    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: `🇮🇩 *CECUN INDONESIA*\n\nNih cecan Indonesia buat kamu! 🔥`,
    }, { quoted: m })

    waitMsg.delete() 
    
  } catch (err) {
    console.error('Plugin cecan error:', err)
    m.reply('❌ Gagal load cecan Indonesia 😿\nCoba lagi nanti!')
  }
}

handler.command = ['indonesia', 'cecan']
handler.tags = ['premium', 'nsfw']
handler.help = ['indonesia', 'cecan']
handler.premium = false
handler.limit = false

export default handler
