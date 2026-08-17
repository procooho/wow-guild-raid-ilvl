import prisma from "@/lib/prisma";
import { getCharacterProfile } from "@/utils/api/blizzard";

// For getting and scanning item level and class for all raiders with daily rate-limiting
export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const today = new Date();
    const todayStr = today.toDateString();

    // Check most recent history across all raiders to see if a scan was recorded today
    const latestHistory = await prisma.itemLevelHistory.findFirst({
      orderBy: { recordedAt: "desc" },
    });

    const alreadyScannedToday = Boolean(
      latestHistory && new Date(latestHistory.recordedAt).toDateString() === todayStr
    );

    // If client only wants to check whether today's scan has been done
    if (req.query.checkOnly === "true") {
      return res.status(200).json({
        alreadyScannedToday,
        lastScanTime: latestHistory?.recordedAt ?? null,
      });
    }

    const force = req.query.force === "true" || req.body?.force === true;

    // Reject regular scan if already scanned today
    if (alreadyScannedToday && !force) {
      return res.status(429).json({
        error: "Daily limit reached. Roster has already been scanned today. Please ask an officer for a refresh.",
        alreadyScannedToday: true,
        lastScanTime: latestHistory?.recordedAt ?? null,
      });
    }

    // Fetch all raiders to scan
    const raiders = await prisma.raider.findMany();

    const updatedRoster = await Promise.all(
      raiders.map(async (raider) => {
        let currentIlvl = raider.currentIlvl;
        let characterClass = raider.characterClass || "Unknown";

        try {
          const profile = await getCharacterProfile(raider.server, raider.name);
          if (profile) {
            currentIlvl = profile.averageItemLevel ?? raider.currentIlvl;
            characterClass = profile.characterClass ?? characterClass;

            // Update raider in DB
            await prisma.raider.update({
              where: { id: raider.id },
              data: {
                currentIlvl,
                characterClass: profile.characterClass ?? undefined,
                faction: profile.faction ?? undefined,
                race: profile.race ?? undefined,
              },
            });

            // Find if this raider already has history recorded today
            const lastHistory = await prisma.itemLevelHistory.findFirst({
              where: { raiderId: raider.id },
              orderBy: { recordedAt: "desc" },
            });

            if (!lastHistory || new Date(lastHistory.recordedAt).toDateString() !== todayStr) {
              await prisma.itemLevelHistory.create({
                data: { raiderId: raider.id, ilvl: currentIlvl },
              });
            } else {
              // Update today's entry so latest ilvl is reflected
              await prisma.itemLevelHistory.update({
                where: { id: lastHistory.id },
                data: { ilvl: currentIlvl, recordedAt: new Date() },
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
    console.error("Error in rosterItemLevels API:", err);
    res.status(500).json({ error: err.message });
  }
}
