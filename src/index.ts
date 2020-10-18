import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
// import { Post } from './entities/Post';
// import { MY_PASSWORD, __prod__ } from './constants';
import microConfig from './mikro-orm.config'
import express from 'express';
import {ApolloServer} from 'apollo-server-express'
import {buildSchema} from 'type-graphql'
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';


const main = async () => {
  const orm = await MikroORM.init(microConfig); // connects to database
  await orm.getMigrator().up(); // runs migration
  
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false
    }),
    context: () => ({ em: orm.em }) // no idea wtf this is
  });

  apolloServer.applyMiddleware({ app })

  app.listen(4000, () => {
    console.log('Server Started on http://localhost:4000')
  })
}

main().catch(err => {
  console.error(err)
});
