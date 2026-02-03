import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command }) => {
  await m.reply('Please wait...');

  try {
    let res = await fetch('https://raw.githubusercontent.com/ArifzynXD/database/master/asupan/korea.json');
    let json = await res.json();
    
    
    const randomIndex = Math.floor(Math.random() * json.length);
    const randomURL = json[randomIndex].url;

   
    await conn.sendFile(m.chat, randomURL, 'trap.png', '', m);
  } catch (error) {
    console.error('Error fetching and sending images:', error);
    await m.reply('An error occurred while fetching and sending images.');
  }
};

handler.tags = ['asupan','premium'];
handler.help = handler.command = ['korea'];
handler.premium = true;

export default handler;
