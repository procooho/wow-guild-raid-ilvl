import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const { showAll } = req.query;
            const where = showAll === "true" ? {} : { view: true };

            const notices = await prisma.notice.findMany({
                where,
                include: { links: true },
                orderBy: { createdAt: "desc" },
            });
            return res.status(200).json(notices);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Failed to fetch notices" });
        }
    }

    if (req.method === "POST") {
        try {
            const { title, note, links = [], view, important, isNew } = req.body;

            if (!title || !note) {
                return res.status(400).json({ error: "Title and Note are required" });
            }

            const notice = await prisma.notice.create({
                data: {
                    title,
                    note,
                    view: view ?? true,
                    important: important ?? false,
                    isNew: isNew ?? true,
                    links: {
                        create: links.map(l => ({
                            url: l.url,
                            description: l.description,
                        })),
                    },
                },
                include: { links: true },
            });

            return res.status(201).json(notice);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Failed to create notice" });
        }
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
