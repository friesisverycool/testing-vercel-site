let data = [];

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const newData = JSON.parse(req.body);
        data = newData;
        res.status(200).json({ status: 'Data saved successfully' });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
