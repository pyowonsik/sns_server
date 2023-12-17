import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsModel } from './entities/posts.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postRepository:Repository<PostsModel>){};

    async getAllPosts(){

      const post = this.postRepository
      .createQueryBuilder('posts')
      .innerJoinAndSelect('posts.author','author')
      .getMany();

      return post;

      

      // // one,many 입장에서 join쿼리 해보기 
      // return this.postRepository.find({
      //   // relations : {
      //   //   author : true
      //   // }
      //   // relations : ['author']
      // });
    }

    async getPostById(id:number){
      
      const post =  await this.postRepository.findOne({
        where:{
          id:id,
        },
        relations: ['author'],
      });  
      if(!post){
        throw new NotFoundException();
      }
      return post;
    }

    async createPost(authorId:number, postDto:CreatePostDto){
      // 1) create() -> 저장할 객체를 생성한다.
        const post = this.postRepository.create({
          author : {
            // post가 어떤 User로 들어갈껀지 정해줘야하기 때문에 파라미터를 authorId(userId)로 받아야 한다.
             id : authorId, 
          }, 
          ...postDto,
          likeCount:0,
          commentCount:0,
        });
      
      // 2) save() -> 객체를 저장한다. (create()에서 생성한 객체로)      
        const newPost = await this.postRepository.save(post);
        return newPost;
    }

    async updatePost(postId:number,postDto : UpdatePostDto){

      const {title , content} = postDto;

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
