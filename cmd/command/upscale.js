import { v2 as cloudinary } from 'cloudinary';
import { downloadMediaMessage } from 'baileys';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default function(ev) {
  ev.on({
    name: 'upscale',
    cmd: ['upscale', 'hd2', 'enhance'],
    tags: 'Tools Menu',
    desc: 'AI upscale image',
    prefix: true,
    money: 800,

    run: async (xp, m, { chat, args, cmd }) => {
      try {
        let quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage;
        let image = quoted?.imageMessage || m.message.imageMessage;
        
        if (!image) {
          return xp.sendMessage(chat.id, { 
            text: `Reply gambar dengan ${cmd}\n\nContoh: .upscale` 
          }, { quoted: m });
        }

        await xp.sendMessage(chat.id, { react: { text: '⏳', key: m.key } });

        let buffer = await downloadMediaMessage(
          quoted ? { message: quoted } : m.message, 
          'buffer'
        );

        if (!buffer) {
          throw new Error('Gagal download gambar');
        }

        let scale = args[0] === '4x' ? 4 : 2;

        let uploadResult = await new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream(
            { 
              resource_type: 'image',
              folder: 'dabi-upscale'
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(buffer);
        });

        let upscaleUrl = cloudinary.url(uploadResult.public_id, {
          transformation: [
            { effect: 'upscale' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        });

        let caption = `✨ AI Upscale ${scale}x\n\n` +
          `📊 ${uploadResult.width}x${uploadResult.height} → ` +
          `${Math.round(uploadResult.width * scale)}x${Math.round(uploadResult.height * scale)}\n` +
          `✅ Enhanced!`;

        await xp.sendMessage(chat.id, {
          image: { url: upscaleUrl },
          caption: caption
        }, { quoted: m });

        await xp.sendMessage(chat.id, { react: { text: '✅', key: m.key } });

      } catch (error) {
        console.log('Upscale error:', error.message);
        await xp.sendMessage(chat.id, { 
          text: '❌ Upscale gagal, coba gambar lain!' 
        }, { quoted: m });
      }
    }
  });
}
