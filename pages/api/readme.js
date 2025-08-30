import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "README.md"); // root folder
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    res.status(200).send(content);
  } catch (err) {
    res.status(500).send("Failed to read README.md");
  }
}