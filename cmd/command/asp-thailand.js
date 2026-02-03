import fetch from 'node-fetch';

let handler = async (m, { conn, command, isPrems }) => {

    try {
        let response = await fetch('https://api.tioprm.eu.org/thailand');
        if (!response.ok) throw new Error('Gagal mengambil data dari API');
        let buffer = await response.buffer(); // Mengambil data gambar sebagai buffer
        conn.sendFile(m.chat, buffer, 'anu.jpg', '_Nih Kak_', m); // Mengirim buffer gambar langsung
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, 'Terjadi kesalahan saat memproses permintaan', m);
    }
};

handler.command = /^(thailand)$/i;
handler.tags = ['asupan','premium'];
handler.help = ['thailand'];
handler.premium = true;
handler.limit = false;

export default handler;