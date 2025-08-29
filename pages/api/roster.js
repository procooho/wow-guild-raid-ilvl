import { prisma } from '@/lib/prisma';
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

      // Validate character exists
      const profile = await getCharacterProfile(server, name);
      if (!profile) {
        return res.status(404).json({ error: `Character "${name}" not found on server "${server}"` });
      }

      // Check if raider already exists
      const existing = await prisma.raider.findFirst({ where: { name: raiderName, server } });
      if (existing) {
        return res.status(409).json({ error: `Raider "${raiderName}" on "${server}" already exists.` });
      }

      const raider = await prisma.raider.create({
        data: {
          name: raiderName,
          server,
          role,
          currentIlvl: profile.averageItemLevel || 0,
        }
      });

      res.status(201).json({ message: `Raider ${raiderName} : Role ${role} Created Successfully`, raider });

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

      // Enrich with Blizzard API class
      const enriched = await Promise.all(
        raiders.map(async (r) => {
          try {
            const profile = await getCharacterProfile(r.server, r.name);
            return {
              ...r,
              characterClass: profile?.characterClass || "Unknown",
            };
          } catch {
            return { ...r, characterClass: "Unknown" };
          }
        })
      );

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