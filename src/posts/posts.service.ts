import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';

export interface PostModel{
    id:number;
    author:string;
    title:string;
    content:string;
    likeCount:number;
    commentCount:number;
  }
  
  let posts : PostModel[] = [
    {
      id:1,
      author:'newJeans_official',
      title:'뉴진스 민지',
      content:'메이크업 고치고 있는 민지',
      likeCount:1000000,
      commentCount:99999,
    },
    {
      id:2,
      author:'newJeans_official',
      title:'뉴진스 해린',
      content:'노래 연습하고 있는 해린',
      likeCount:1000000,
      commentCount:99999,
    },
    {
      id:3,
      author:'blackpink_official',
      title:'블랙핑크 로제',
      content:'종합운동장에서 운동하고 있는 로제',
      likeCount:1000000,
      commentCount:99999,
    }
  ];
  
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postRepository:Repository<PostModel>){};

    async getAllPosts(){
      return this.postRepository.find();
    }

    async getPostById(id:number){
      
      const post =  await this.postRepository.findOne({
        where:{
          id:id,
        }
      });  
      if(!post){
        throw new NotFoundException();
      }
      return post;
    }

    async createPost(author:string,title:string,content:string){
      // 1) create() -> 저장할 객체를 생성한다.
        const post = this.postRepository.create({
          author, // author : author,
          title,
          content,
          likeCount:0,
          commentCount:0,
        });
      
      // 2) save() -> 객체를 저장한다. (create()에서 생성한 객체로)      
        const newPost = await this.postRepository.save(post);
        return newPost;
    }

    async updatePost(postId:number,author:string,title:string,content:string){


    // sava의 기능
    // 1) 만약에 데이터가 존재하지 않는 다면 (id기준) 새로 생성한다.
    // 2) 만약에 데이터가 존재한다면 (같은 id의 값이 존재한다면) 존재 하던 값을 update한다.

    const post = await this.postRepository.findOne({
      where:{
        id:postId
      },
    }); 
    
    if(!post){
      throw new NotFoundException();
    }

    if(author){
      post.author = author;
    }

    if(title){
      post.title = title;
    }

    if(content){
      post.content = content;
    }

    const newPost = await this.postRepository.save(post);
    return newPost;

    }

    async deletePost(postId:number){
    const post = await this.postRepository.findOne({
      where:{
        id:postId
      }
    });

    if(!post){
      throw new NotFoundException();
    }

    await this.postRepository.delete(postId);
    return postId; 
  }
}
