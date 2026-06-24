import { GraphQLClient } from 'graphql-request';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { baseUrl } from './app.config';

export const graphqlClient = new GraphQLClient(baseUrl);

export const client = new ApolloClient({
  uri: baseUrl,
  cache: new InMemoryCache(),
});
