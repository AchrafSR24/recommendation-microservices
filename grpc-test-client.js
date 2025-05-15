const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.join(__dirname, "recommendation-service", "recommendation.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const recommendationProto = grpc.loadPackageDefinition(packageDefinition).recommendation;

const client = new recommendationProto.RecommendationService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

client.GetRecommendations({ userId: "123" }, (err, response) => {
  if (err) {
    console.error("Erreur gRPC :", err);
  } else {
    console.log("Recommandations pour l'utilisateur  :", response.products);
  }
});
