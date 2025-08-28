import { prisma } from "@/lib/prisma";
import { getCharacterProfile } from "@/utils/api/blizzard";

//For getting item level and class

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    //getting name of all raiders
    const raiders = await prisma.raider.findMany();

    //getting item level and class for all raiders
    const updatedRoster = await Promise.all(
      raiders.map(async (raider) => {
        let currentIlvl = raider.currentIlvl;
        let characterClass = "Unknown";

        try {
          const profile = await getCharacterProfile(raider.server, raider.name);
          if (profile) {
            currentIlvl = profile.averageItemLevel || currentIlvl;
            characterClass = profile.characterClass || "Unknown";
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
