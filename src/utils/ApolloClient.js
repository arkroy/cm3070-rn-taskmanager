import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import awsconfig from '../aws-exports';

const client = new ApolloClient({
  link: new HttpLink({
    uri: awsconfig.aws_appsync_graphqlEndpoint,
    headers: {
      'x-api-key': awsconfig.aws_appsync_apiKey,
    },
  }),
  cache: new InMemoryCache(),
});

export default client;