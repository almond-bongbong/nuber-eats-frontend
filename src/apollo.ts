import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from '@apollo/client';
import { LOCALSTORAGE_TOKEN_KEY } from './constants';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
export const isLoggedInVar = makeVar(Boolean(token));
export const authTokenVar = makeVar(token);

const wsLink = new WebSocketLink({
  uri:
    process.env.NODE_ENV === 'production'
      ? 'wss://nuber-eats-backend-cmlee.herokuapp.com/graphql'
      : 'ws://localhost:4001/graphql',
  options: {
    reconnect: true,
    connectionParams: {
      Authorization: localStorage.getItem(LOCALSTORAGE_TOKEN_KEY) || '',
    },
  },
});

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === 'production'
      ? 'https://nuber-eats-backend-cmlee.herokuapp.com/graphql'
      : 'http://localhost:4001/graphql',
});

const authLink = setContext((operation, prevContext) => {
  return {
    headers: {
      ...prevContext.headers,
      authorization: localStorage.getItem(LOCALSTORAGE_TOKEN_KEY) || '',
    },
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          token: {
            read() {
              return authTokenVar();
            },
          },
        },
      },
    },
  }),
});
