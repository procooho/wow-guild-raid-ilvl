import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const posts = await prisma.officerPost.findMany({
                include: { youtubeLinks: true, wclLinks: true },
                orderBy: { createdAt: "desc" },
            });
            return res.status(200).json(posts);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Failed to fetch posts" });
        }
    }

    if (req.method === "POST") {
        try {
            const { title, description, youtubeLinks = [], wclLinks = [] } = req.body;

            if (!title) return res.status(400).json({ error: "Title is required" });

            const post = await prisma.officerPost.create({
                data: {
                    title,
                    description,
                    youtubeLinks: { create: youtubeLinks.map(url => ({ url })) },
                    wclLinks: { create: wclLinks.map(url => ({ url })) },
                },
                include: { youtubeLinks: true, wclLinks: true },
            });

            return res.status(201).json(post);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Failed to create post" });
        }
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
