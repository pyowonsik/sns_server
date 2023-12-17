import { BaseModel } from "src/common/entity/common.entity";
import { PostsModel } from "src/posts/entities/posts.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RolesEnum } from "../const/roles.const";
import { IsString,Length,IsEmail, ValidationArguments } from "class-validator";
import { LengthValidationMessage } from "src/common/validation-message/length-validation.message";
import { StringValidationMessage } from "src/common/validation-message/string-validation.message";
import { EmailValidationMessage } from "src/common/validation-message/email-validation.message";
import { Exclude, Expose } from "class-transformer";

@Entity()
export class UsersModel extends BaseModel{

    @Column({
        length : 20,
        unique : true,
    })
    @IsString({
        message : StringValidationMessage
    })
    @Length(1,20,{
        message : LengthValidationMessage,
    })
    // 1) 길이가 20을 넘지 않을것
    // 2) 유일무이한 값이 될걸
    nickname : string;
    
    @Column({
        unique : true
    })
    @IsString({
        message : StringValidationMessage
    })
    @IsEmail({},{
        message : EmailValidationMessage
    })
    // 2) 유일무이한 값이 될걸
    email : string;

    @Column()
    @IsString({
        message : StringValidationMessage
    })
    @Length(3,8,{
        message : LengthValidationMessage
    })
     /**
     * Request
     * frontend -> backend
     * plain object (JSON) -> class instance (DTO)
     * 
     * Response
     * backend -> fronend
     * class instance (DTO) -> plain object(JSON)
     * toPlainOnly -> plain object로 변환
     * toClassOnly -> class instance로 변환
     */
    @Exclude({
        toPlainOnly : true
    })
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