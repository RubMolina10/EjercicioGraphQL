
import { ApolloServer } from "apollo-server";
import { typeDefs } from "../graphql/typeDefs.js";
import { resolvers } from "../graphql/resolvers.js";
import { errorMessages, successMessages } from "../messages/messages.js";    

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(successMessages.SERVERNPORT + ' ' +`${url}`);
});
