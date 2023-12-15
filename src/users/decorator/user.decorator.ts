import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { UsersModel } from "../entities/users.entity";

export const User = createParamDecorator((data : keyof UsersModel | undefined,context : ExecutionContext) => {

    // ExcutionContext : 요청값의 정보를 받을수 있다.

    const req = context.switchToHttp().getRequest();

    
    const user = req.user as UsersModel;

    // AccessTokenGuard를 통과했을때만 사용가능
    // 요청 객체에 사용자 정보가 있어야 하기 때문
    if(!user){
        throw new InternalServerErrorException('Request에 user 프로퍼티가 존재하지 않습니다.');
    }

    // 데이터에 key값이 온다면 user['key']의 value를 반환 , Model을 반환 하는것이 아님
    if(data){
        return user[data];
    }

    return user;
});
