require('dotenv').config();

import { allSchemas } from './schemas/schemas';
import { allResolvers } from './resolvers/resolvers';

import * as mongoose from 'mongoose';
import { GraphQLSchema } from 'graphql';
import { mergeSchemas } from 'graphql-tools';
import { PersistedQueryNotFoundError } from 'apollo-server-errors';
import { userController } from './controllers/user.controller';
const Koa = require('koa');
const { ApolloServer } = require('apollo-server-koa');
const jwt = require('koa-jwt');
const jsonwebtoken = require('jsonwebtoken');

const PORT=8000;

const mongoUrl = process.env.MONGO_URL;

mongoose.set('debug', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(
  mongoUrl,
  { useNewUrlParser: true },
  function(err: any) {
    if (err) throw err;

    console.log('Successfully connected to Mongo');
  },
);


const schema: GraphQLSchema = mergeSchemas({
  schemas: allSchemas,
  resolvers: allResolvers,
});

const server = new ApolloServer({
  schema,
  context: async ({ ctx }) => {
    const user = await userController.getMyUser(ctx);
    // add the user to the context
    return { user };
  },
});

const app = new Koa();

server.applyMiddleware({ app });

app.listen(PORT, () =>
  console.log('🚀 Server ready at http://localhost:8000${server.graphqlPath}'),
);
