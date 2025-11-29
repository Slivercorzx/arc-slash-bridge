export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (req.headers['x-secret'] !== process.env.REGISTER_SECRET) return res.status(403).end();

  const defs = [
    { name:'item', description:'ค้นหาไอเท็ม', type:1,
      options:[{ name:'name', description:'ชื่อไอเท็ม', type:3, required:true }] },
    { name:'craft', description:'ดูวัสดุที่ต้องใช้คราฟต์', type:1,
      options:[{ name:'name', description:'ชื่อไอเท็ม', type:3, required:true }] },
    { name:'drop', description:'ดูแหล่งดรอป', type:1,
      options:[{ name:'name', description:'ชื่อไอเท็ม', type:3, required:true }] }
  ];

  const url = `https://discord.com/api/v10/applications/${process.env.DISCORD_APPLICATION_ID}/guilds/${process.env.DISCORD_GUILD_ID}/commands`;
  const r = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'arc-commands-register/1.0'
    },
    body: JSON.stringify(defs)
  });
  const text = await r.text();
  res.status(r.status).send(text);
}
