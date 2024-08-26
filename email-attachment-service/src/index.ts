import express, { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import { getXmlAttachments } from './emailService';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/getDocuments', async (req: Request, res: Response) => {
  try {
    // Chama a função sem passar credenciais, usando as credenciais padrão
    const attachments = await getXmlAttachments();

    // Save to MongoDB
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    const db = client.db('emailService');
    const collection = db.collection('attachments');
    await collection.insertMany(attachments);
    await client.close();

    res.json(attachments);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
