const express = require('express');
const axios = require('axios');
const { request, gql } = require('graphql-request'); // 👈 nouveau
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const app = express();
const PORT = 3000;

// gRPC setup
const PROTO_PATH = path.join(__dirname, 'recommendation.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const recommendationProto = grpc.loadPackageDefinition(packageDefinition).recommendation;

const client = new recommendationProto.RecommendationService(
  'recommendation-service:50051',
  grpc.credentials.createInsecure()
);


app.get('/recommendations/:userId', (req, res) => {
  const userId = req.params.userId;
  client.GetRecommendations({ userId }, (err, response) => {
    if (err) {
      console.error('gRPC error:', err);
      return res.status(500).json({ error: 'Erreur gRPC' });
    }
    res.json({ userId, recommendations: response.products });
  });
});


app.get('/users', async (req, res) => {
  try {
    const response = await axios.get('http://user-service:3001/users');
    res.json(response.data);
  } catch (err) {
    console.error('Erreur user-service:', err.message);
    res.status(500).json({ error: 'Erreur user-service' });
  }
});


app.get('/products', async (req, res) => {
  const endpoint = 'http://product-service:3002/graphql';

  const query = gql`
    {
      products {
        id
        title
        description
        category
      }
    }
  `;

  try {
    const data = await request(endpoint, query);
    res.json(data.products);
  } catch (err) {
    console.error('Erreur GraphQL product-service:', err.message);
    res.status(500).json({ error: 'Erreur product-service' });
  }
});

app.listen(PORT, () => {
  console.log(`API Gateway is running at http://localhost:${PORT}`);
});
