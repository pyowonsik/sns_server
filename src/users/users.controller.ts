 import { Body, ClassSerializerInterceptor, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  /**
   * serialization -> 직렬화 -> 현재 시스템에서 사용되는 데이터 구조를 다른 시스템에서도 사용할수 있는 format으로 변환
   * deserialization -> 역직렬회 
   */
  getUsers(){
    return this.usersService.getAllUsers();
  }


  // @Post('')
  // postUser(
  //   @Body('nickname') nickname:string,
  //   @Body('email') email:string,
  //   @Body('password') password:string,
  // ){
  //   return this.usersService.createUser({
  //     nickname,
  //     email,
  //     password
  //   });
  // }
}
