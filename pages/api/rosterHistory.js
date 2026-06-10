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
      const d = new Date(record.recordedAt);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      if (!dailyAverages[dateKey]) {
        dailyAverages[dateKey] = {};
      }
      
      // Keep the highest item level for each raider on a given day
      if (!dailyAverages[dateKey][record.raiderId] || record.ilvl > dailyAverages[dateKey][record.raiderId]) {
         dailyAverages[dateKey][record.raiderId] = record.ilvl;
      }
    });

    const chartData = Object.keys(dailyAverages).map(dateKey => {
      const raiderRecords = Object.values(dailyAverages[dateKey]);
      const avg = raiderRecords.reduce((sum, val) => sum + val, 0) / Math.max(raiderRecords.length, 1);
      const [year, month, day] = dateKey.split('-');
      return {
        date: `${month}/${day}`,
        fullDate: dateKey,
        ilvl: Number(avg.toFixed(2))
      };
    });

    // Ensure strict chronological sorting
    chartData.sort((a, b) => a.fullDate.localeCompare(b.fullDate));

    res.status(200).json(chartData);
  } catch (err) {
    console.error("❌ Error fetching roster history:", err);
    res.status(500).json({ error: "Failed to fetch roster history" });
  }
}
