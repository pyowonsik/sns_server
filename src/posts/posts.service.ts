import { Injectable, NotFoundException } from '@nestjs/common';




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

    getAllPosts(){
        return posts;
    }

    getPostById(id:number){
        const post = posts.find((post) => post.id === +id); // type 비교시 string 타입에 +하면 number와 비교 가능
        if(!post){
          throw new NotFoundException();
        }
        return post;
    }

    createPost(author:string,title:string,content:string){
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

    updatePost(postId:number,author:string,title:string,content:string){
         // posts 내부의 id와 매개변수로 받은 id를 비교해서 id가 있다면 Patch Target
    const post = posts.find((post) => post.id === postId); 

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
    posts.map(prevPost => prevPost.id === postId ? post : prevPost);
    return post;
    }

    deletePost(postId:number){

    const post = posts.find((post) => post.id === postId); 

    if(!post){
      throw new NotFoundException();
    }
    posts = posts.filter(post => post.id !== + postId);

    return postId;

    }
}
