import prisma from "@/lib/prisma";
import { getCharacterProfile } from "@/utils/api/blizzard";

//For get detailed information from api

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { name, server, role } = req.body;

  if (!name || !server) {
    return res.status(400).json({ error: "Missing name or server" });
  }

  try {
    console.log(`🔍 Fetching character info for ${name} on ${server}...`);

    // Fetch profile from Blizzard API
    const profile = await getCharacterProfile(server, name);

    // Show error when there's no match
    if (!profile) {
      console.error(`❌ Character "${name}" not found on server "${server}"`);
      return res
        .status(404)
        .json({ error: `Character "${name}" not found on server "${server}"` });
    }

    console.log(`✅ Got profile for ${name}:`, profile);

    // Capitalize first letter of name
    const formattedName = profile.name.charAt(0).toUpperCase() + profile.name.slice(1);

    // Extract item level, if nothing, show 0
    const currentIlvl = profile.averageItemLevel ?? 0;

    // Find existing raider in database
    let raider = await prisma.raider.findUnique({
      where: { name_server: { name: formattedName, server } },
    });

    // If not existing,
    if (!raider) {
      // Create new raider
      raider = await prisma.raider.create({
        data: {
          name: formattedName,
          server,
          role,
          currentIlvl,
        },
      });
      console.log(`📝 Created new raider: ${formattedName}`);
    } else {
      // Update existing raider
      raider = await prisma.raider.update({
        where: { id: raider.id },
        data: {
          currentIlvl,
          role: raider.role,
        },
      });
      console.log(`📝 Updated raider: ${formattedName}`);
    }

    // Fetch last item level history
    const lastHistory = await prisma.itemLevelHistory.findFirst({
      where: { raiderId: raider.id },
      orderBy: { recordedAt: "desc" },
    });

    const today = new Date();
    let recordedToday = false;

    // if there's no last history, or nothing recorede today, create new one
    if (!lastHistory || new Date(lastHistory.recordedAt).toDateString() !== today.toDateString()) {
      await prisma.itemLevelHistory.create({
        data: {
          raiderId: raider.id,
          ilvl: currentIlvl,
        },
      });
    } else {
      // Update the existing record for today so we capture same-day ilvl growth
      await prisma.itemLevelHistory.update({
        where: { id: lastHistory.id },
        data: { ilvl: currentIlvl }
      });
      recordedToday = true;
    }

    // Get recent histories to find distinct days (up to 30 for the graph)
    const rawHistory = await prisma.itemLevelHistory.findMany({
      where: { raiderId: raider.id },
      orderBy: { recordedAt: "desc" },
      take: 30,
    });

    // Deduplicate history by date string to ensure variance is calculated correctly
    // across different days, avoiding 0 variance from duplicate same-day records.
    const uniqueHistoryMap = new Map();
    for (const h of rawHistory) {
      const dateStr = new Date(h.recordedAt).toDateString();
      if (!uniqueHistoryMap.has(dateStr)) {
        uniqueHistoryMap.set(dateStr, h);
      }
    }
    const history = Array.from(uniqueHistoryMap.values());

    const response = {
      raider: {
        name: raider.name,
        server: raider.server,
        role: raider.role,
        currentIlvl: raider.currentIlvl,
        history,
        lastChecked: lastHistory?.recordedAt ?? new Date(),
        recordedToday,
      },
      profile: {
        faction: profile.faction ?? "Unknown",
        characterClass: profile.characterClass ?? "Unknown",
        race: profile.race ?? "Unknown",
      },
    };

    console.log(`✅ Sending character info for ${name}`);
    res.status(200).json(response);
  } catch (err) {
    console.error("❌ Error in characterInfo API:", err);
    console.error("Error details:", {
      name,
      server,
      role,
      message: err.message,
      stack: err.stack
    });
    return res.status(500).json({
      error: err.message,
      details: `Failed to fetch character info for ${name} on ${server}`
    });
  }
}
