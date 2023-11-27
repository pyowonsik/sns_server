import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity()   // 테이블 생성 
export class PostsModel{
    @PrimaryGeneratedColumn()
    id : string;
    @Column()
    author: string;
    @Column()
    title : string;
    @Column()
    content:string;
    @Column()
    likeCount:number;
    @Column()
    commentCount:number;
}