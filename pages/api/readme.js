import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'README.md');
    const content = fs.readFileSync(filePath, 'utf8');
    res.status(200).json({ content });
  } catch (error) {
    console.error("Error reading README.md:", error);
    res.status(500).json({ error: "Failed to read README file" });
  }
}