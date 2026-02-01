import { v2 as cloudinary } from 'cloudinary'
import axios from 'axios'
import { downloadMediaMessage } from 'baileys'  
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
            text: `Kirim/reply gambar dengan caption:\n\`${cmd} [2x|4x]\`\n\nContoh: .upscale 2x` 
          }, { quoted: m })
        }

        await xp.sendMessage(chat.id, { react: { text: '⏳', key: m.key } })

      
        const buffer = await downloadMediaMessage(
          { message: q || m.message }, 
          'buffer', 
          {}, 
          { logger: xp.logger, reuploadRequest: xp.updateMediaMessage }
        )

        if (!buffer) throw new Error('Gagal download gambar')

        const scale = parseFloat(args[0]) || 2
        if (![1, 2, 4].includes(scale)) {
          return xp.sendMessage(chat.id, { text: 'Scale: 1x, 2x, atau 4x saja!' }, { quoted: m })
        }

        
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { 
              resource_type: 'image',
              public_id: `upscale_${Date.now()}_${Math.ra
