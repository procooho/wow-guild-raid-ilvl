import { prisma } from '@/lib/prisma';

//For update role and delete(delete not being used)

export default async function handler(req, res) {
    const { id } = req.query;
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) return res.status(400).json({ error: 'Invalid raider ID' });

    // Handle role update
    if (req.method === 'PATCH') {
        const { role } = req.body;
        if (!role || !['TANK', 'DPS', 'HEALER'].includes(role.toUpperCase())) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        try {
            const updatedRaider = await prisma.raider.update({
                where: { id: parsedId },
                data: { role: role.toUpperCase() },
            });
            return res.status(200).json(updatedRaider);
        } catch (err) {
            console.error(err);
            if (err.code === 'P2025') return res.status(404).json({ error: 'Raider not found' });
            return res.status(500).json({ error: 'Failed to update raider role' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            // Delete item history first
            await prisma.itemLevelHistory.deleteMany({ where: { raiderId: parsedId } });

            // Then delete raider
            await prisma.raider.delete({ where: { id: parsedId } });

            return res.status(200).json({ message: 'Raider deleted' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete raider' });
        }
    }

    res.setHeader('Allow', ['PATCH']);
    res.status(405).send(`Method ${req.method} Not Allowed`);
}
