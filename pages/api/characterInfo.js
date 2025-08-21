import { prisma } from "@/lib/prisma";
import { getCharacterProfile } from "@/utils/api/blizzard";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  //if name or server is not provided, throw error
  const { name, server, role } = req.body;
  if (!name || !server) {
    return res.status(400).json({ error: "Missing name or server" });
  }

  try {
    //get profile from blizzard api
    const profile = await getCharacterProfile(server, name);
    //set current item level from blizzard api
    const currentIlvl = profile.averageItemLevel;

    //find or create raider - check name and server both match
    let raider = await prisma.raider.findUnique({
      where: { name_server: { name: profile.name, server } },
    });

    //if raider is not existed, create new one
    //else, update item level and role
    if (!raider) {
      raider = await prisma.raider.create({
        data: {
          name: profile.name,
          server,
          role: role,
          currentIlvl,
        },
      });
    } else {
      raider = await prisma.raider.update({
        where: { id: raider.id },
        data: {
          currentIlvl,
          role: raider.role,
        },
      });
    }

    //check last recorded item level using id
    const lastHistory = await prisma.itemLevelHistory.findFirst({
      where: { raiderId: raider.id },
      orderBy: { recordedAt: "desc" },
    });

    const today = new Date();
    let recordedToday = false;

    //record new item level only if it's not recorded today
    //else, set flag for recorded today
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

    //get the 2 recent histories for check progress
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
        faction: profile.faction,
        characterClass: profile.characterClass,
        race: profile.race,
      },
    });
  } catch (err) {
    console.error("Error updating raider ilvl:", err);
    return res.status(500).json({ error: err.message });
  }
}
