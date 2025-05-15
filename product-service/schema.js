const { gql } = require('apollo-server-express'); 
const mongoose = require('mongoose');

const Product = mongoose.model("Product", new mongoose.Schema({
  title: String,
  description: String,
  category: String
}));

const typeDefs = gql`
  type Product {
    id: ID!
    title: String!
    description: String!
    category: String!
  }

  type Query {
    products: [Product]
  }

  type Mutation {
    addProduct(title: String!, description: String!, category: String!): Product
    updateProduct(id: ID!, title: String, description: String, category: String): Product
    deleteProduct(id: ID!): String
  }
`;

const resolvers = {
  Query: {
    products: async () => await Product.find({})
  },
  Mutation: {
    addProduct: async (_, args) => {
      const newProduct = new Product(args);
      return await newProduct.save();
    },

    updateProduct: async (_, { id, ...updates }) => {
      const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedProduct) {
        return ("Ce produit n'existe pas");
      }
      return updatedProduct;
    },

    deleteProduct: async (_, { id }) => {
      const deleted = await Product.findByIdAndDelete(id);
      if (!deleted) {
        return ("Ce produit n'existe pas");
      }
      return `Produit supprimé avec succès : ${id}`;
    }
}
}

module.exports = { typeDefs, resolvers };
