const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'analytics-engine',
  brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'analytics-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'interactions', fromBeginning: true });

  console.log(" Analytics Engine connecté à Kafka. En attente d'événements...");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      console.log(` Événement reçu : ${value}`);                                
    }
  });
};

run().catch(console.error);
