const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.join(__dirname, "recommendation.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const recommendationProto = grpc.loadPackageDefinition(packageDefinition).recommendation;

function GetRecommendations(call, callback) {
  const userId = call.request.userId;
  console.log("Generating recommendations for user:", userId);


  const recommendations = [
    "Produit A",
    "Produit B",
    "Produit C"
  ];

  callback(null, { products: recommendations });
}

function main() {
  const server = new grpc.Server();
  server.addService(recommendationProto.RecommendationService.service, { GetRecommendations });

  server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), () => {
    console.log("Recommendation Service running at http://0.0.0.0:50051");
    server.start();
  });
}

main();
