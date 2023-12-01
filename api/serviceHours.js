// api/serviceHours.js

const { MongoClient } = require('mongodb');

async function connectToDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client.db('WLNDATA');
}

module.exports = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('serviceHours');

    if (req.method === 'POST') {
      const { body } = req;
      await collection.insertOne(body);
      res.status(200).json({ success: true });
    } else if (req.method === 'GET') {
      const data = await collection.find({}).toArray();
      res.status(200).json(data);
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
