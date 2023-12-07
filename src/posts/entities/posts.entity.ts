import { BaseModel } from "src/common/entity/common.entity";
import { UsersModel } from "src/users/entities/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()   // 테이블 생성 
export class PostsModel extends BaseModel{

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