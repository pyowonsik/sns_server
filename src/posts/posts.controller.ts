import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { PostsService } from './posts.service';

interface PostModel{
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

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 1) GET /posts
  // 모든 posts를 다 가져온다.
  @Get() // http://localhost:3000/posts
  getPosts(){
    return posts;
  }

  // 2) GET /posts/:id
  // id에 해당되는 post를 가져온다.
  // 예를 들어서 id=1인 경우 id가 1인 post를 가져온다.
  @Get(':id') // http://localhost:3000/posts/:id
  getPost(@Param('id') id:string){
    const post = posts.find((post) => post.id === +id); // type 비교시 string 타입에 +하면 number와 비교 가능
    if(!post){
      throw new NotFoundException();
    }
    return post;
  }

  

  // 3) POST /posts
  // post를 생성한다.
  @Post() // http://localhost:3000/posts
  postPosts(
    @Body('author') author:string,
    @Body('title') title:string,
    @Body('content') content:string, 
  ){
    const post : PostModel = {
      id:posts[posts.length - 1].id + 1,
      author, // author : author
      title,
      content,
      likeCount : 0,
      commentCount:0,
    }

    posts = [...posts,post];
    return post;
  }

  // 4) PATCH  /posts/:id
  // id에 해당하는 post를 변경한다.
  @Patch(':id')
  patchPost(
    @Param('id') id : string,
    @Body('author') author?:string,
    @Body('title') title?:string,
    @Body('content') content?:string, 
  ){
    // posts 내부의 id와 매개변수로 받은 id를 비교해서 id가 있다면 Patch Target
    const post = posts.find((post) => post.id === +id); 

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

    // Target 이라면 새로 변경한 post를 넣어준다.
    posts.map(prevPost => prevPost.id === +id ? post : prevPost);
    return post;

  }

  // 5) DELETE /posts/:id
  // id에 해당하는 post를 삭제한다.
  @Delete(':id')
  deletePost(@Param('id') id : string){
    const post = posts.find((post) => post.id === +id); 

    if(!post){
      throw new NotFoundException();
    }
    posts = posts.filter(post => post.id !== + id);

    return id;

  }

}
