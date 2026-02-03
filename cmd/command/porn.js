import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, text, command } = {}) => {
  
  if (!m || !conn) return
  
  const eror = '❌ *PORNHUB SEARCH ERROR*\nCoba lagi nanti atau pakai query lain!'
  
  let lister = ["search", "gif"]
  let [feature, ...inputs] = text.split("|").map(v => v.trim())
  inputs = inputs.join("|").trim()
  
  if (!lister.includes(feature)) {
    return m.reply(`*📺 PORNHUB SEARCH*

*Example:*
\`${usedPrefix}${command} search|vpn\`
\`${usedPrefix}${command} gif|asian\`

*Pilih type:*
${lister.map((v, i) => `○ ${v}`).join('\n')}`)
  }
  
  if (feature == "search" && !inputs) {
    return m.reply("❌ Input query untuk search!")
  }
  
  if (feature == "gif" && !inputs) {
    return m.reply("❌ Input query untuk gif!")
  }
  
  try {
    let res
    if (feature == "search") {
      res = await searchVideo(inputs)
    } else {
      res = await searchGif(inputs)
    }
    
    if (!res || res.length === 0) {
      return m.reply('❌ No results found!')
    }
    
    let teks = res.slice(0, 5).map((item, index) => {
      if (feature == "search") {
        return `*[ ${index + 1} ]*
📺 *${item.title.substring(0, 50)}...*
👤 ${item.uploader}
👀 ${item.views}
⏱️ ${item.duration}
🔗 ${item.link}`
      } else {
        return `*[ ${index + 1} ]*
🎬 *${item.title.substring(0, 40)}...*
🔗 ${item.url}`
      }
    }).join('\n\n─────────────────\n\n')
    
    await m.reply(teks)
    
  } catch (e) {
    console.error('Pornhub error:', e)
    m.reply(eror)
  }
}

handler.help = ["pornhub"]
handler.tags = ["internet", "premium", "nsfw"]
handler.command = /^(pornhub)$/i
handler.premium = true
export default handler


async function searchVideo(query) {
  const url = `https://www.pornhub.com/video/search?search=${encodeURIComponent(query)}`
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  })
  const html = await response.text()
  const $ = cheerio.load(html)
  
  const videoList = []
  $('li[data-rid]').slice(0, 10).each((i, el) => {
    const $el = $(el)
    const title = $el.find('.title a').text().trim()
    const link = $el.find('.title a').attr('href')
    const uploader = $el.find('.videoUploaderLink').text().trim()
    const views = $el.find('.videoViewsBlock').text().trim()
    const duration = $el.find('.duration').text().trim()
    
    if (title && link) {
      videoList.push({
        link: `https://www.pornhub.com${link}`,
        title,
        uploader: uploader || 'Unknown',
        views: views || '0',
        duration: duration || 'N/A'
      })
    }
  })
  return videoList
}


async function searchGif(query) {
  const url = `https://www.pornhub.com/gifs/search?search=${encodeURIComponent(query)}`
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  })
  const html = await response.text()
  const $ = cheerio.load(html)
  
  const gifs = []
  $('div.gifs').find('a.phimage').slice(0, 10).each((i, el) => {
    const $el = $(el)
    const title = $el.find('.title').text().trim()
    const href = $el.attr('href')
    
    if (title && href) {
      const gifId = href.split('/')[2]
      gifs.push({
        title,
        url: `https://ci.phncdn.com/videos/2023/${gifId}/720P_1800K_999999/${gifId}-720P.mp4`,
        webm: `https://ci.phncdn.com/gifs/${gifId}_250.gif`
      })
    }
  })
  return gifs
}
