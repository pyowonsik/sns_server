import { UsersModel } from "src/users/entities/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()   // 테이블 생성 
export class PostsModel{

    @PrimaryGeneratedColumn()
    id : number;

    // PostModel은 UserModel의 posts가 된다.
    // 1) UsersModel과 연동한다 Foregin Key를 이용해서 
    // 2) null이 될수 없다.
    @ManyToOne(()=>UsersModel,(user) => user.posts,{
        nullable : false,
    })
    author: UsersModel;
    
    @Column()
    title : string;
    
    @Column()
    content:string;
    
    @Column()
    likeCount:number;
    
    @Column()
    commentCount:number;
}