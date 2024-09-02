import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import awsconfig from '../aws-exports';
import { fetchAuthSession } from '@aws-amplify/auth'; // Updated import

const httpLink = new HttpLink({
  uri: awsconfig.aws_appsync_graphqlEndpoint,
});

const authLink = setContext(async (_, { headers }) => {
  try {
    const session = await fetchAuthSession(); // Fetch the current session
    const token = session.tokens?.accessToken || '';

    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
  } catch (error) {
    console.error('Error getting auth session:', error);
    return { headers };
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;