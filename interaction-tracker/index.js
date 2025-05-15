const express = require('express');
const { Kafka } = require('kafkajs');

const app = express();
app.use(express.json());

const kafka = new Kafka({
  clientId: 'interaction-tracker',
  brokers: ['kafka:9092']
});

const producer = kafka.producer();


const waitForKafka = async (retries = 5, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await producer.connect();
      console.log("Kafka connecté !");
      return;
    } catch (err) {
      console.log(`Kafka pas prêt, tentative ${i + 1}/${retries}...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  console.error("Impossible de se connecter à Kafka après plusieurs tentatives.");
  process.exit(1);
};

app.post('/track', async (req, res) => {
  const { userId, event } = req.body;

  if (!userId || !event) {
    return res.status(400).json({ error: 'userId and event are required' });
  }

  await producer.send({
    topic: 'interactions',
    messages: [
      {
        key: userId,
        value: JSON.stringify({ userId, event, timestamp: new Date().toISOString() })
      }
    ]
  });

  console.log(`Événement envoyé : ${userId} - ${event}`);
  res.json({ status: 'sent' });
});

const start = async () => {
  await waitForKafka();
  app.listen(3003, () => {
    console.log('Interaction Tracker listening on port 3003');
  });
};

start();
