/**
 * Vercel Serverless Function — /api/verify
 * Lisans kodunu doğrular.
 *
 * POST /api/verify
 * Body: { "license": "XXXX-XXXX-XXXX-XXXX" }
 * Yanıt: { "valid": true/false, "message": "..." }
 */

// ── Lisans Kodları ────────────────────────────────────────────────────────
// Buraya arkadaşlarının kodlarını ekle/çıkar.
// Format: "KOD": { "name": "Kişi adı", "active": true/false }
const LICENSES = {
  "XTYM-A1B2-C3D4-E5F6": { name: "DevHSN2",   active: true  },
  "XTYM-B2C3-D4E5-F6G7": { name: "ruhungidasiai",  active: true  }
};

export default function handler(req, res) {
  // CORS ayarları — extension'dan gelen isteklere izin ver
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS preflight
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
