import prisma from '@/lib/prisma';
import { getCharacterProfile } from '@/utils/api/blizzard';

function capitalizeName(name) {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

export default async function handler(req, res) {

  //Add Raider to database with name capitalized
  if (req.method === "POST") {
    const { name, server, role } = req.body;

    if (!name || !server || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const raiderName = capitalizeName(name);

      // Check if raider already exists
      const existing = await prisma.raider.findFirst({ where: { name: raiderName, server } });
      if (existing) {
        return res.status(409).json({ error: `Raider "${raiderName}" on "${server}" already exists.` });
      }

      // Try to validate character with Blizzard API (optional)
      let profile = null;
      let ilvl = 0;
      let characterClass = "Unknown";

      try {
        profile = await getCharacterProfile(server, name);
        if (profile) {
          ilvl = profile.averageItemLevel || 0;
          characterClass = profile.characterClass || "Unknown";
        }
      } catch (apiError) {
        console.warn(`Blizzard API unavailable, creating raider without validation:`, apiError.message);
        // Continue without API validation
      }

      const raider = await prisma.raider.create({
        data: {
          name: raiderName,
          server,
          role,
          currentIlvl: ilvl,
        }
      });

      res.status(201).json({
        message: `Raider ${raiderName} : Role ${role} Created Successfully`,
        raider: {
          ...raider,
          characterClass: characterClass
        }
      });

    } catch (err) {
      console.error(err);

      // Handle Prisma unique constraint errors
      if (err.code === "P2002") {
        return res.status(409).json({ error: `Raider "${name}" already exists on "${server}"` });
      }

      return res.status(500).json({ error: "Failed to create raider", details: err.message });
    }
  }

  //Get roster, add class from blizzard api, return

  else if (req.method === "GET") {
    try {
      const raiders = await prisma.raider.findMany({
        include: { history: { take: 1 } },
        orderBy: { name: 'asc' },
      });

      console.log(`📊 Fetching roster data for ${raiders.length} raiders...`);

      // Enrich with Blizzard API class
      const enriched = await Promise.all(
        raiders.map(async (r) => {
          try {
            console.log(`🔍 Fetching profile for ${r.name} on ${r.server}...`);
            const profile = await getCharacterProfile(r.server, r.name);
            console.log(`✅ Got profile for ${r.name}:`, profile?.characterClass || 'Unknown');
            return {
              ...r,
              characterClass: profile?.characterClass || "Unknown",
            };
          } catch (error) {
            console.error(`❌ Failed to fetch profile for ${r.name}:`, error.message);
            return { ...r, characterClass: "Unknown" };
          }
        })
      );

      console.log(`✅ Returning ${enriched.length} enriched raiders`);
      return res.status(200).json(enriched);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch raiders" });
    }
  }

  //Delete raider from database

  else if (req.method === "DELETE") {
    const { id } = req.query;
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
      return res.status(400).json({ error: "Invalid raider ID" });
    }

    try {
      await prisma.itemLevelHistory.deleteMany({ where: { raiderId: parsedId } });

      const deletedRaider = await prisma.raider.delete({ where: { id: parsedId } });

      return res.status(200).json({ message: `Raider ${deletedRaider.name} deleted` });
    } catch (err) {
      console.error(err);
      if (err.code === "P2025") {
        return res.status(404).json({ error: `Raider with ID ${parsedId} not found` });
      }
      return res.status(500).json({ error: "Failed to delete raider" });
    }
  }
}