require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const { typeDefs, resolvers } = require('./schema');

const startServer = async () => {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected to Product Service"))
    .catch(err => console.error("Mongo error", err));

  app.listen(process.env.PORT, () => {
    console.log(`Product Service listening on http://localhost:${process.env.PORT}${server.graphqlPath}`);
  });
};

startServer();
