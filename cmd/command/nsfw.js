let handler = async (m, { conn, args, usedPrefix, command } = {}) => {
  
  if (!m || !conn) return
  
  const wait = `⏳ Loading *${command.toUpperCase()}*...`
  await m.reply(wait)
  
  try {
    let res = await fetch(`https://fantox-apis.vercel.app/${command}`)
    if (!res.ok) throw new Error(`API failed: ${res.status}`)
    
    let json = await res.json()
    if (!json.url) throw new Error('No image URL found')
    
    await conn.sendFile(m.chat, json.url, `${command}.jpg`, `
🚩 *Random ${command}*
_${command}_ 💦`, m)
    
  } catch (error) {
    console.error(`${command} error:`, error)
    m.reply(`❌ *${command.toUpperCase()}* failed!\nCoba command lain 😿`)
  }
}

handler.help = ['swimsuit','schoolswimsuit','white','barefoot','touhou','gamecg','hololive','uncensored','sunglasses','glasses','shirtlift','chain','fingering','flatchest','torncloth','bondage','demon','wet','pantypull','headdress','headphone','tie','anusview','shorts','stokings','topless','beach','bunnygirl','bunnyear','idol','vampire','gun','maid','bra','nobra','bikini','whitehair','blonde','pinkhair','bed','ponytail','nude','dress','underwear','foxgirl','uniform','skirt','sex','sex2','sex3','breast','twintail','spreadpussy','tears','seethrough','breasthold','drunk','fateseries','spreadlegs','openshirt','headband','food','close','tree','nipples','erectnipples','horns','greenhair','wolfgirl','catgirl']

handler.command = ['swimsuit','schoolswimsuit','white','barefoot','touhou','gamecg','hololive','uncensored','sunglasses','glasses','shirtlift','chain','fingering','flatchest','torncloth','bondage','demon','wet','pantypull','headdress','headphone','tie','anusview','shorts','stokings','topless','beach','bunnygirl','bunnyear','idol','vampire','gun','maid','bra','nobra','bikini','whitehair','blonde','pinkhair','bed','ponytail','nude','dress','underwear','foxgirl','uniform','skirt','sex','sex2','sex3','breast','twintail','spreadpussy','tears','seethrough','breasthold','drunk','fateseries','spreadlegs','openshirt','headband','food','close','tree','nipples','erectnipples','horns','greenhair','wolfgirl','catgirl']

handler.tags = ['premium', 'nsfw']
handler.premium = true
handler.private = false

export default handler
