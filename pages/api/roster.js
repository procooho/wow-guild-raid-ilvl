import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, server, faction, class } = req.body;
    const user = await prisma.user.create({ data: { name, server, faction, class } });
    res.status(201).json(user);
  }
}