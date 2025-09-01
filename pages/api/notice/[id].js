import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === "GET") {
        try {
            const notice = await prisma.notice.findUnique({
                where: { id: Number(id) },
                include: { links: true },
            });
            if (!notice) return res.status(404).json({ error: "Notice not found" });
            return res.status(200).json(notice);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Failed to fetch notice" });
        }
    }

    if (req.method === "PUT") {
        try {
            const { title, note, links = [], view, important, isNew } = req.body;

            const notice = await prisma.notice.update({
                where: { id: Number(id) },
                data: {
                    title,
                    note,
                    view,
                    important,
                    isNew,
                    links: {
                        deleteMany: {},
                        create: links.map(l => ({
                            url: l.url,
                            description: l.description,
                        })),
                    },
                },
                include: { links: true },
            });

            return res.status(200).json(notice);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Failed to update notice" });
        }
    }

    if (req.method === "DELETE") {
        try {
            const noticeId = parseInt(id, 10);

            const deletedNotice = await prisma.notice.delete({
                where: { id: noticeId },
            });

            return res.status(200).json({
                message: "Notice permanently deleted",
                notice: deletedNotice,
            });
        } catch (err) {
            console.error("Hard delete notice error:", err);
            return res.status(500).json({ error: "Failed to delete notice", details: err.message });
        }
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
