// api/list.js
import { readdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

export default async function handler(req, res) {
  const { dir } = req.query;

  // Whitelist allowed folders for security
  const ALLOWED_DIRS = [
    'balloon_arches',
    'eternal_roses',
    'flower_bouquets',
    'flower_mix',
    'graduation',
    'hotwheels_bouquets',
    'money_bouquets',
    'owner_picture',
    'personalized_bouquets',
    'plushie_arrangements',
    'room_decorations',
    'surprise_boxes'
  ];

  if (!dir || !ALLOWED_DIRS.includes(dir)) {
    return res.status(400).json({ error: 'Invalid or missing directory' });
  }

  try {
    const folderPath = join(__dirname, '..', dir);
    const files = await readdir(folderPath);
    const imageFiles = files
      .filter(file => {
        const ext = '.' + file.split('.').pop().toLowerCase();
        return IMAGE_EXTENSIONS.has(ext);
      })
      .map(file => `${dir}/${file}`);

    res.status(200).json({ images: imageFiles });
  } catch (err) {
    console.error('Error reading directory:', err);
    res.status(500).json({ error: 'Failed to read directory' });
  }
}
