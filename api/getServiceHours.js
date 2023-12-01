let data = [];

export default async function handler(req, res) {
    if (req.method === 'GET') {
        res.status(200).json(data);
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
