import { Post } from '../entities/Post'
import { MyContext } from 'src/types'
import {Arg, Ctx, Int, Mutation, Query, Resolver} from 'type-graphql'

// Queries are for finding data
// Mutations are for changing data

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(
    @Ctx() {em}: MyContext
  ): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true }) // this is setting GraphQL type, cannot do Post | null (differently from TS), thats why we put an pbj with nullable true
  post(
    @Arg('id', () => Int) id: number,
    @Ctx() {em}: MyContext
  ): Promise<Post | null> { // This is the TypeScript type, can be either Post or null, so we use Post | null synthax
    return em.findOne(Post, {id});
  }

  @Mutation(() => Post, { nullable: true }) // this is setting GraphQL type, cannot do Post | null (differently from TS), thats why we put an pbj with nullable true
  async createPost(
    @Arg('title', () => String) title: string,
    @Ctx() {em}: MyContext // no clue what that line is lol
  ): Promise<Post> { // This is the TypeScript type, can be either Post or null, so we use Post | null synthax
    const post = em.create(Post, {title});
    await em.persistAndFlush(post);
    return post
  }

  @Mutation(() => Post, { nullable: true }) // this is setting GraphQL type, cannot do Post | null (differently from TS), thats why we put an pbj with nullable true
  async updatePost( // Need to pass title and ID;
    @Arg('id', () => Number) id: number,
    @Arg('title', () => String) title: string,
    @Ctx() {em}: MyContext // no clue what that line is lol
  ): Promise<Post | null> { // This is the TypeScript type, can be either Post or null, so we use Post | null synthax
    const post = await em.findOne(Post, {id});
    if (!post) {
      return null
    }
    if (typeof title !== 'undefined') {
      post.title = title;
      await em.persistAndFlush(post);
    }
    return post;
  }

  @Mutation(() => Boolean, { nullable: true }) // this is setting GraphQL type, cannot do Post | null (differently from TS), thats why we put an pbj with nullable true
  async deletePost( // Need to pass title and ID;
    @Arg('id', () => Number) id: number,
    @Ctx() {em}: MyContext // no clue what that line is lol
  ): Promise<boolean> { // This is the TypeScript type, can be either Post or null, so we use Post | null synthax
    await em.nativeDelete(Post, {id})
    return true;
  }
}