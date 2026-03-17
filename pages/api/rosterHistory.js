import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const allHistory = await prisma.itemLevelHistory.findMany({
      orderBy: { recordedAt: "asc" }
    });

    const dailyAverages = {};

    allHistory.forEach(record => {
      const dateStr = new Date(record.recordedAt).toLocaleDateString(undefined, {
        month: '2-digit',
        day: '2-digit',
      });

      if (!dailyAverages[dateStr]) {
        dailyAverages[dateStr] = {};
      }
      
      // Keep the highest item level for each raider on a given day
      if (!dailyAverages[dateStr][record.raiderId] || record.ilvl > dailyAverages[dateStr][record.raiderId]) {
         dailyAverages[dateStr][record.raiderId] = record.ilvl;
      }
    });

    const chartData = Object.keys(dailyAverages).map(dateStr => {
      const raiderRecords = Object.values(dailyAverages[dateStr]);
      const avg = raiderRecords.reduce((sum, val) => sum + val, 0) / Math.max(raiderRecords.length, 1);
      return {
        date: dateStr,
        ilvl: Number(avg.toFixed(2))
      };
    });

    // In case there are too many days, let's keep the last 30
    const finalData = chartData.slice(-30);

    res.status(200).json(finalData);
  } catch (err) {
    console.error("❌ Error fetching roster history:", err);
    res.status(500).json({ error: "Failed to fetch roster history" });
  }
}
