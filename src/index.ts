import { MikroORM } from '@mikro-orm/core';
import { Post } from './entities/Post';
// import { MY_PASSWORD, __prod__ } from './constants';
import microConfig from './mikro-orm.config'

const main = async () => {
  const orm = await MikroORM.init(microConfig); // connects to database
  await orm.getMigrator().up(); // runs migration

  // const post = orm.em.create(Post, {title: 'my first post'});
  // await orm.em.persistAndFlush(post);

  const posts = await orm.em.find(Post, {})
  console.log(posts);
}

main().catch(err => {
  console.error(err)
});
