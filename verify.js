/**
 * Vercel Serverless Function — /api/verify
 * Lisans kodunu doğrular.
 */

const LICENSES = {
  "XTYM-A1B2-C3D4-E5F6": { name: "Ahmet",  active: true },
  "XTYM-B2C3-D4E5-F6G7": { name: "Mehmet", active: true },
  "XTYM-C3D4-E5F6-G7H8": { name: "Ayşe",   active: true },
  // Yeni kod eklemek için bu satırı kopyala:
  // "XTYM-XXXX-XXXX-XXXX": { name: "Ad Soyad", active: true },
};

export default function handler(req, res) {
  // CORS — tüm originlere izin ver
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Preflight isteği
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ valid: false, message: 'Method not allowed' });
  }

  const { license } = req.body || {};

  if (!license || typeof license !== 'string') {
    return res.status(400).json({ valid: false, message: 'Lisans kodu girilmedi.' });
  }

  const code  = license.trim().toUpperCase();
  const entry = LICENSES[code];

  if (!entry) {
    return res.status(200).json({ valid: false, message: 'Geçersiz lisans kodu.' });
  }

  if (!entry.active) {
    return res.status(200).json({ valid: false, message: 'Bu lisans kodu devre dışı bırakılmış.' });
  }

  return res.status(200).json({
    valid:   true,
    message: `Hoş geldin, ${entry.name}!`,
    name:    entry.name,
  });
}
