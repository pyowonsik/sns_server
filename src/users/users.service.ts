import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersModel } from './entities/users.entity';

@Injectable()
export class UsersService {
    constructor ( 
        @InjectRepository(UsersModel) 
        private readonly usersRepository : Repository<UsersModel>
    ){}

    async createUser(user : Pick<UsersModel,'nickname' | 'email'|'password'>){
        // 1) nickname 중복이 없는지 확인
        // exist() -> 조건에 해당되는 값이 있으면 true
        const nicknameExists = await this.usersRepository.exist({
            where:{
                nickname : user.nickname,
            }
        });

        if(nicknameExists){
            throw new BadRequestException('이미 존재하는 닉네임 입니다!');
        }

        const emailExists = await this.usersRepository.exist({
            where : {
                email : user.email,
            }
        });

        if(emailExists){
            throw new BadRequestException('이미 존재하는 이메일 입니다.!');
        }


        const userObject = this.usersRepository.create({
            nickname : user.nickname,
            email : user.email,
            password : user.password,
        });

        const newUser = await this.usersRepository.save(userObject);
        return newUser;
    }
    
    async getAllUsers(){

        const user = await this.usersRepository
        .createQueryBuilder('user')
        .innerJoinAndSelect('user.posts','posts')
        .getMany();

        // 기준 테이블 : user , 참조 테이블 : post
        // inner join : (posts)참조 테이블에에 데이터가 없는 
        // (user)기준 테이블은 조회를 하지 않는다.
        // left join : (posts)참조 테이블에 데이터가 있던 없던 
        // (user)기준테이블에 데이터가 있으면 조회

        // console.log(result);

        return user;
        // return this.usersRepository.find({relations: {
        //     // posts : true
        // }});
    }

    async getUserByEmail(email:string){
        return this.usersRepository.findOne({
            where:{
                email,
            },
        });
    }
}
