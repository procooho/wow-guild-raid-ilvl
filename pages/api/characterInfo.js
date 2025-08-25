import { prisma } from "@/lib/prisma";
import { getCharacterProfile } from "@/utils/api/blizzard";

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
    // Fetch profile from Blizzard API
    const profile = await getCharacterProfile(server, name);

    if (!profile) {
      return res
        .status(404)
        .json({ error: `Character "${name}" not found on server "${server}"` });
    }

    // Capitalize first letter of name
    const formattedName = profile.name.charAt(0).toUpperCase() + profile.name.slice(1);

    const currentIlvl = profile.averageItemLevel ?? 0;

    // Find existing raider
    let raider = await prisma.raider.findUnique({
      where: { name_server: { name: formattedName, server } },
    });

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
    } else {
      // Update existing raider's item level
      raider = await prisma.raider.update({
        where: { id: raider.id },
        data: {
          currentIlvl,
          role: raider.role,
        },
      });
    }

    // Fetch last item level history
    const lastHistory = await prisma.itemLevelHistory.findFirst({
      where: { raiderId: raider.id },
      orderBy: { recordedAt: "desc" },
    });

    const today = new Date();
    let recordedToday = false;

    if (!lastHistory || new Date(lastHistory.recordedAt).toDateString() !== today.toDateString()) {
      await prisma.itemLevelHistory.create({
        data: {
          raiderId: raider.id,
          ilvl: currentIlvl,
        },
      });
    } else {
      recordedToday = true;
    }

    // Get the 2 most recent histories
    const history = await prisma.itemLevelHistory.findMany({
      where: { raiderId: raider.id },
      orderBy: { recordedAt: "desc" },
      take: 2,
    });

    res.status(200).json({
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
    });
  } catch (err) {
    console.error("Error updating raider ilvl:", err);
    return res.status(500).json({ error: err.message });
  }
}
