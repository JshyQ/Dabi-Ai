import axios from 'axios'
import * as cheerio from 'cheerio'

async function NekopoiSearch(query, page = 1) {
  const baseUrl = 'https://nekopoi.care/search/'
  const results = []

  try {
    const url = page === 1 ? `${baseUrl}${encodeURIComponent(query)}` : `${baseUrl}${encodeURIComponent(query)}/page/${page}/?${encodeURIComponent(query)}`
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    const $ = cheerio.load(response.data)
    const items = $('div.result ul li')
    if (items.length === 0) return results

    items.each((index, element) => {
      const titleElement = $(element).find('h2 a')
      const title = titleElement.text().trim()
      const url = titleElement.attr('href')
      const thumbnail = $(element).find('img').attr('src')
      if (title && url) results.push({ title, url, thumbnail })
    })

    return results
  } catch (error) {
    console.error('Error Nekopoi Search:', error.message)
    return []
  }
}

async function NekopoiDetail(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    const $ = cheerio.load(response.data)
    const result = {
      title: $('div.eroinfo h1').text().trim(),
      parody: '',
      producer: '',
      duration: '',
      views: '',
      date: '',
      thumbnail: $('div.thm img').attr('src') || '',
      sizes: {},
      streams: [],
      downloads: {}
    }

    $('div.konten p').each((i, el) => {
      const text = $(el).text().trim()
      if (text.startsWith('Parody')) result.parody = text.replace('Parody : ', '').trim()
      else if (text.startsWith('Producers')) result.producer = text.replace('Producers : ', '').trim()
      else if (text.startsWith('Duration')) result.duration = text.replace('Duration : ', '').trim()
      else if (text.includes('Size')) {
        const sizeMatches = text.match(/(\d+P)\s*:\s*([\d.]+mb)/gi)
        if (sizeMatches) {
          sizeMatches.forEach(match => {
            const [resolution, size] = match.split(' : ')
            result.sizes[resolution.trim()] = size.trim()
          })
        }
      }
    })

    const viewsDateText = $('div.eroinfo p').text().trim()
    const viewsMatch = viewsDateText.match(/Dilihat\s+([\d.]+)\s+kali/)
    const dateMatch = viewsDateText.match(/\/\s+(.+)/)
    result.views = viewsMatch ? viewsMatch[1] : ''
    result.date = dateMatch ? dateMatch[1].trim() : ''

    $('div#show-stream div.openstream iframe').each((i, el) => {
      const src = $(el).attr('src')
      if (src) result.streams.push({ name: `Stream ${i + 1}`, url: src })
    })

    $('div.boxdownload div.liner').each((i, el) => {
      const resolution = $(el).find('div.name').text().match(/\[(\d+p)\]/)?.[1]
      if (resolution) {
        const links = { normal: [], ouo: [] }
        $(el).find('div.listlink p a').each((i, linkEl) => {
          const href = $(linkEl).attr('href')
          const text = $(linkEl).text().trim()
          if (href.includes('ouo.io')) links.ouo.push({ name: text.replace('[ouo]', ''), url: href })
          else links.normal.push({ name: text, url: href })
        })
        result.downloads[resolution] = links
      }
    })

    return result
  } catch (error) {
    console.error('Error Nekopoi Detail:', error.message)
    return null
  }
}

let handler = async (m, { args, conn }) => {
  const subcommand = (args[0] || '').toLowerCase()
  switch (subcommand) {
    case 'search': {
      const keyword = args.slice(1).join(' ')
      if (!keyword) return m.reply('Masukkan judul hentai!\nContoh: .nekopoi search Alya')
      m.reply('Mencari di Nekopoi...')
      const results = await NekopoiSearch(keyword)
      if (!results.length) return m.reply('Tidak ditemukan.')
      let rows = results.slice(0, 10).map(item => ({
        header: 'Hentai',
        title: item.title,
        description: item.url,
        id: `.nekopoi detail ${item.url}`
      }))
      conn.sendMessage(m.chat, {
        text: `Hasil pencarian untuk *${keyword}*`,
        footer: 'Klik untuk lihat detail',
        buttons: [
          {
            buttonId: 'action',
            buttonText: { displayText: 'Pilih Judul' },
            type: 4,
            nativeFlowInfo: {
              name: 'single_select',
              paramsJson: JSON.stringify({
                title: 'Hasil Pencarian',
                sections: [
                  {
                    title: 'Daftar Judul',
                    highlight_label: 'Nekopoi',
                    rows
                  }
                ]
              })
            }
          }
        ],
        headerType: 1,
        viewOnce: true
      }, { quoted: m })
      break
    }
    case 'detail': {
      const url = args[1]
      if (!url || !url.startsWith('http')) return m.reply('Link hentai tidak valid!\nContoh: .nekopoi detail https://nekopoi.care/l2d-alya-kujou-alisa-mikhailovna-tonari-no-alya-san/')
      m.reply('Mengambil detail...')
      const data = await NekopoiDetail(url)
      if (!data) return m.reply('Gagal mendapatkan detail.')
      let teks = `*${data.title}*\n\n`
      teks += `*Parody:* ${data.parody}\n`
      teks += `*Producer:* ${data.producer}\n`
      teks += `*Durasi:* ${data.duration}\n`
      teks += `*Dilihat:* ${data.views} kali\n`
      teks += `*Tanggal:* ${data.date}\n`
      teks += `*Ukuran File:*\n`
      Object.entries(data.sizes).forEach(([res, size]) => {
        teks += `  - ${res}: ${size}\n`
      })
      teks += `\n*Streaming:*`
      if (data.streams.length) {
        data.streams.forEach(stream => {
          teks += `\n  - ${stream.name}: ${stream.url}`
        })
      } else {
        teks += '\n  Tidak ada link streaming.'
      }
      teks += `\n\n*Download:*\n`
      Object.entries(data.downloads).forEach(([res, links]) => {
        teks += `  *${res}:*\n`
        if (links.normal.length) {
          teks += '    Normal:\n'
          links.normal.forEach(link => {
            teks += `      - ${link.name}: ${link.url}\n`
          })
        }
        if (links.ouo.length) {
          teks += '    Ouo:\n'
          links.ouo.forEach(link => {
            teks += `      - ${link.name}: ${link.url}\n`
          })
        }
      })
      await conn.sendMessage(m.chat, {
        image: { url: data.thumbnail },
        caption: teks,
        footer: 'Nekopoi',
      }, { quoted: m })
      break
    }
    default:
      m.reply('Command tidak dikenali, gunakan:\n.nekopoi search <keyword>\n.nekopoi detail <url>')
  }
}

handler.command = /^(nekopoi)$/i
handler.help = ['nekopoi search <keyword>', 'nekopoi detail <url>']
handler.tags = ['internet']
handler.limit = true
handler.register = true

export default handler