import { prisma } from "@/lib/prisma";
import { getCharacterProfile } from "@/utils/api/blizzard";

//For getting item level and class

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    //getting name of all raiders
    const raiders = await prisma.raider.findMany();
    const today = new Date();

    //getting item level and class for all raiders
    const updatedRoster = await Promise.all(
      raiders.map(async (raider) => {
        let currentIlvl = raider.currentIlvl;
        let characterClass = "Unknown";

        try {
          const profile = await getCharacterProfile(raider.server, raider.name);
          if (profile) {
            currentIlvl = profile.averageItemLevel ?? raider.currentIlvl;
            characterClass = profile.characterClass ?? "Unknown";

            // Update raider in DB
            await prisma.raider.update({
              where: { id: raider.id },
              data: { currentIlvl },
            });

            // Add to history if not already recorded today
            const lastHistory = await prisma.itemLevelHistory.findFirst({
              where: { raiderId: raider.id },
              orderBy: { recordedAt: "desc" },
            });

            if (!lastHistory || new Date(lastHistory.recordedAt).toDateString() !== today.toDateString()) {
              await prisma.itemLevelHistory.create({
                data: { raiderId: raider.id, ilvl: currentIlvl },
              });
            }
          }
        } catch (err) {
          console.warn(`Failed to fetch profile for ${raider.name}:`, err);
        }

        return { ...raider, currentIlvl, characterClass };
      })
    );

    res.status(200).json(updatedRoster);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
