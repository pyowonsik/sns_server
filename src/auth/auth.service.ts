import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { HASH_ROUND, JWT_SECRET } from './const/auth.const';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
      private readonly jwtService : JwtService,  
      private readonly usersServie : UsersService
      
    ){}

    /**
     * 1) resgisterWithEmail (회원가입)
     *  - email , nickname , password를 입력받고 사용자를 생성
     *  - 생성이 완료되면 accessToken과 refreshToken을 반환
     *    회원가입후 다시 로그인해주세요 <- 이런 쓸때없는 과정을 방지하기 위해서
     * 
     * 2) loginWithEmai (로그인)
     *  - email,password를 입력하면 사용자 검증을 진행한다.
     *  - 검증이 완료 되면 accessToken과 refreshtToken을 반환한다.
     *  
     * 3) loginUser (토큰반환)
     *  - (1)과(2)에서 필요한 accessToken과 refreshToken을 반환한다.
     * 
     * 4) signToken (토큰 sign)
     *  - (3)에서 필요한 accessToken과 refreshToken을 sign하는 로직 
     * 
     * 5) athenticateWithEmailAndPassword (검증)
     *  - (2)에서 로그인을 진행할때 필요한 기본적인 검증 진행 
     *    1. 사용자가 존재하는지 확인
     *    2. 비밀번호가 맞는지 확인
     *    3. 모두 통과되면 찾은 사용자 정보 반환
     *    4. loginWithEmail에서 반환되는 데이터를 기반으로 토큰 생성  
     */

    /**
     * PayLoad에 들어갈 정보
     * 1) email
     * 2) sub -> id
     * 3) type -> 'access | refresh'
     */
    signToken(user:Pick<UsersModel,'email' | 'id'>,isRefreshToken : boolean){
        const payload = {
            email : user.email,
            id : user.id,
            isRefreshToken : isRefreshToken ? 'refresh' : 'access'
        };

        return this.jwtService.sign(payload,{
            secret: JWT_SECRET,
            expiresIn : payload.isRefreshToken ? 3600 : 300
        });
    }


    loginUser(user:Pick<UsersModel,'email'|'id'>){
        return {
            accessToken : this.signToken(user,false),
            refreshToken : this.signToken(user,true),
        }
    }

    async athenticateWithEmailAndPassword(user:Pick<UsersModel,'email' | 'password'>){
        /**
         * 1. 사용자가 존재하는지 확인
         * 2. 비밀번호가 맞는지 확인
         * 3. 모두 통과되면 찾은 사용자 정보 반환
         */

        const existingUser = await this.usersServie.getUserByEmail(user.email);

        if(!existingUser ){
            throw new UnauthorizedException('존재하지 않는 사용자 입니다.');
        }

        /**
         * 1) 입력된 비밀번호
         * 2) 기존 해시 -> 사용자 정보에 저장된 hash 
         */
        const passOk = await bcrypt.compare(user.password,existingUser.password);

        if(!passOk) {
            throw new UnauthorizedException('비밀번호가 틀렸습니다.');
        }
        
        return existingUser; 
    }

    async loginWithEmail(user:Pick<UsersModel,'email' | 'password'>){
        const existingUser = await this.athenticateWithEmailAndPassword(user);
        return this.loginUser(existingUser);
    }

    async registerWithEmail(user:Pick<UsersModel,'nickname'|'email'|'password'>){
        const hash = await bcrypt.hash(
            user.password,
            HASH_ROUND  
        );

        const newUser = await this.usersServie.createUser(user);

        return this.loginUser(newUser);
    }
}
