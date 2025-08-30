import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const { role } = req.body;

    if (!["TANK", "HEALER", "DPS", "MELEEDPS", "RANGEDPS"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    try {
      const raider = await prisma.raider.update({
        where: { id: parseInt(id) },
        data: { role },
      });
      res.status(200).json(raider);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update role" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}