import { v2 as cloudinary } from 'cloudinary'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export default function upscale(ev) {
  ev.on({
    name: 'upscale',
    cmd: ['upscale', 'hd2', 'enhance', 'aiupscale'],
    tags: 'Tools Menu',
    desc: 'AI upscale image 2x-4x with Cloudinary',
    owner: false,
    prefix: true,
    money: 800,
    exp: 0.5,

    run: async (xp, m, { chat, args, cmd }) => {
      try {
        
        const q = m.message?.extendedTextMessage?.contextInfo?.quotedMessage
        const img = q?.imageMessage || m.message?.imageMessage
        
        if (!img) {
          return xp.sendMessage(chat.id, { 
            text: `Kirim/reply gambar dengan caption ${cmd} [scale]\n\n*Contoh:*\n${cmd} 2x\n${cmd} 4x` 
          }, { quoted: m })
        }

        await xp.sendMessage(chat.id, { react: { text: '⏳', key: m.key } })

      
        const buffer = await downloadMediaMessage({ message: q || m.message }, 'buffer')
        if (!buffer) throw new Error('Gagal download gambar')

       
        const scale = parseFloat(args[0]) || 2
        if (![1, 2, 4].includes(scale)) {
          return xp.sendMessage(chat.id, { text: 'Scale: 1x, 2x, atau 4x saja!' }, { quoted: m })
        }

      
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { 
              resource_type: 'image',
              public_id: `upscale_${Date.now()}`,
              folder: 'dabi-ai-upscale'
            },
            (error, result) => {
              if (error) reject(error)
              else resolve(result)
            }
          ).end(buffer)
        })

        
        const upscaleUrl = cloudinary.url(uploadResult.public_id, {
          transformation: [
            { effect: 'e_upscale', upscale: scale === 1 ? 1 : scale === 2 ? 2 : 4 },
            { quality: 'auto' },
            { fetch_format: 'auto' },
            { width: Math.min(2000, uploadResult.width * scale), crop: 'limit' }
          ]
        })

        const caption = `✨ *AI Upscale ${scale}x*\n` +
          `📈 Original: ${uploadResult.width}x${uploadResult.height}\n` +
          `🎯 Upscaled: ${(uploadResult.width * scale).toFixed(0)}x${(uploadResult.height * scale).toFixed(0)}\n` +
          `🔗 ${upscaleUrl}`

        
        await xp.sendMessage(chat.id, {
          image: { url: upscaleUrl },
          caption: caption
        }, { quoted: m })

        await xp.sendMessage(chat.id, { react: { text: '✅', key: m.key } })

      } catch (error) {
        console.error('Upscale error:', error)
        await xp.sendMessage(chat.id, { 
          text: '❌ Gagal upscale gambar:\n' + error.message 
        }, { quoted: m })
      }
    }
  })
}
