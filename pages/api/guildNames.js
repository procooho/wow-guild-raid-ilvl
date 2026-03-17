import { getGuildRoster } from "@/utils/api/blizzard";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { realm = "tichondrius", guild = "awaken-reunited" } = req.query;

  try {
    const names = await getGuildRoster(realm, guild);
    if (!names) {
      return res.status(404).json({ error: "Guild not found or API error" });
    }
    
    // Set a moderate cache so we don't spam Blizzard API on every keypress reload
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).json(names);
  } catch (error) {
    console.error("Guild fetch error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
