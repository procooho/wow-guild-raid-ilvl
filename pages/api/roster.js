import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, server, role } = req.body;
    try {
      const raider = await prisma.raider.create({
        data: {
          name,
          server,
          role
        }
      });
      res.status(201).json(raider);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create raider" });
    }
  }

  else if (req.method === "GET") {
    try {
      const raiders = await prisma.raider.findMany({
        include: {
          history: {
            take: 1
          }
        }
      });
      res.status(200).json(raiders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch raiders" });
    }
  }

  else if (req.method === "DELETE") {
    const { id } = req.query;
    try {
      await prisma.raider.delete({
        where: { id: parseInt(id) }
      });
      res.status(200).json({ message: `Raider ${id} deleted` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete raider" });
    }
  }
}