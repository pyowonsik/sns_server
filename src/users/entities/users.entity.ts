import { PostsModel } from "src/posts/entities/posts.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolesEnum } from "../const/roles.const";


@Entity()
export class UsersModel{

    @PrimaryGeneratedColumn()
    id : number;

    @Column({
        length : 20,
        unique : true,
    })
    // 1) 길이가 20을 넘지 않을것
    // 2) 유일무이한 값이 될걸
    nickname : string;
    
    @Column({
        unique : true
    })
    // 2) 유일무이한 값이 될걸
    email : string;

    @Column()
    password : string;

    @Column({
        enum : Object.values(RolesEnum),
        default : RolesEnum.USER,
    })
    role : RolesEnum;

    // UserModel은 PostModel의 author가 된다.
    @OneToMany(() => PostsModel,(post) => post.author)
    posts : PostsModel[];
}