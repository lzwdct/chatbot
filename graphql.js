const { ApolloServer, gql } = require('apollo-server-lambda');
const { types } = require('./types');
const { resolvers } = require('./resolvers/index');

const server = new ApolloServer({
    typeDefs: types,
    resolvers,
    context(request) {
        return {
            request
        }
    },
    playground: {
        endpoint: "/dev/graphql"
    }
})

exports.graphqlHandler = server.createHandler({
    cors: {
      origin: '*',
      credentials: true,
    },
});