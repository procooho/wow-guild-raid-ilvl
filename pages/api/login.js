import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Missing credentials' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (user && user.password === password) {
            // In a real app, sign a JWT here. 
            // For now, we return success so frontend can set its simple state.
            return res.status(200).json({ success: true, message: 'Logged in successfully' });
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
