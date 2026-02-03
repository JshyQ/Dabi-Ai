import fetch from 'node-fetch'

const handler = async (m, { conn }) => {
  try {
    await conn.sendMessage(m.chat, {
      react: {
        text: '🇻🇳',
        key: m.key
      }
    })

    const res = await fetch('https://api.siputzx.my.id/api/r/cecan/vietnam')
    const buffer = await res.buffer()

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption: 'Nih asupan vietnam buat kamu!',
    }, { quoted: m })

  } catch (err) {
    console.error('Plugin cecan error:', err)
    await conn.sendMessage(m.chat, {
      text: 'Terjadi kesalahan saat mengambil gambar.',
    }, { quoted: m })
  }
}

handler.command = ['vietnam']
handler.tags = ['premium']
handler.help = ['vietnam']
handler.premium = true
handler.limit = false

export default handler