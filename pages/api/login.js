const OFFICER_ID = process.env.OFFICER_ID; 
const OFFICER_PW = process.env.OFFICER_PW;

export default function loginHandler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { id, password } = req.body;

    if (id === OFFICER_ID && password === OFFICER_PW) {
        res.status(200).json({ success: true, message: "Login successful" });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials." });
    }
}