import { prisma } from "@/lib/prisma";
import { getCharacterProfile } from "@/utils/api/blizzard";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const raiders = await prisma.raider.findMany();

    //convert day to milliseconds
    const oneDay = 24 * 60 * 60 * 1000;

    const updatedRoster = await Promise.all(
      raiders.map(async (raider) => {
        //get the most recent item level history
        const lastHistory = await prisma.itemLevelHistory.findFirst({
          where: { raiderId: raider.id },
          orderBy: { recordedAt: "desc" },
        });

        const lastCheck = lastHistory?.recordedAt;

        let currentIlvl = raider.currentIlvl;

        //get new item level if it's been more than a day or no history exists
        if (!lastCheck || Date.now() - new Date(lastCheck) > oneDay) {
          const profile = await getCharacterProfile(raider.server, raider.name);

          // skip if profile is null
          if (profile) {
            currentIlvl = profile.averageItemLevel;

            // save new item level in history
            await prisma.itemLevelHistory.create({
              data: {
                raiderId: raider.id,
                ilvl: currentIlvl,
              },
            });

            // update current item level in Raider table
            await prisma.raider.update({
              where: { id: raider.id },
              data: { currentIlvl },
            });
          } else {
            console.warn(`Skipping ${raider.name} on ${raider.server}, profile not found.`);
          }
        }

        return { ...raider, currentIlvl, lastCheck };
      })
    );

    res.status(200).json(updatedRoster);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}