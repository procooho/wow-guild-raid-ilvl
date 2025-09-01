import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === "GET") {
        try {
            const post = await prisma.officerPost.findUnique({
                where: { id: Number(id) },
                include: { youtubeLinks: true, wclLinks: true },
            });
            if (!post) return res.status(404).json({ error: "Post not found" });
            return res.status(200).json(post);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Failed to fetch post" });
        }
    }

    if (req.method === "PUT") {
        try {
            const { title, description, youtubeLinks = [], wclLinks = [] } = req.body;

            const post = await prisma.officerPost.update({
                where: { id: Number(id) },
                data: {
                    title,
                    description,
                    youtubeLinks: {
                        deleteMany: {},
                        create: youtubeLinks.map(url => ({ url })),
                    },
                    wclLinks: {
                        deleteMany: {},
                        create: wclLinks.map(url => ({ url })),
                    },
                },
                include: { youtubeLinks: true, wclLinks: true },
            });

            return res.status(200).json(post);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Failed to update post" });
        }
    }

    if (req.method === "DELETE") {
        try {
            const postId = parseInt(id, 10);

            await prisma.youtubeLink.deleteMany({ where: { postId } });
            await prisma.wclLink.deleteMany({ where: { postId } });

            const deletedPost = await prisma.officerPost.delete({
                where: { id: postId },
            });

            return res.status(200).json(deletedPost);
        } catch (err) {
            console.error("Delete post error:", err);
            return res.status(500).json({ error: "Failed to delete post", details: err.message });
        }
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
