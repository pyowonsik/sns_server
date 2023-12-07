import { Body, Controller, Post , Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MaxLengthPipe, MinLengthPipe, PasswordPipe } from './pipe/password.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  async postTokenAccess(
    @Headers('authorization') rawToken : string,
  ){
    const token =  this.authService.extractTokenFromHeader(rawToken,true);

    /**
     * {accessToken : {token}}
     */

    const newToken =  await this.authService.rotateToken(token,false);

    return {
      accessToken : newToken,
    }
  }


  @Post('token/refresh')
  async postTokenRefresh(
    @Headers('authorization') rawToken : string,
  ){
    const token =  this.authService.extractTokenFromHeader(rawToken,true);

    /**
     * {refreshToken  : {token}}
     */

    const newToken =  await this.authService.rotateToken(token,true);
    return {
      refreshToken : newToken,
    }
  }

  @Post('login/email')
  postLoginEmail(
    @Headers('authorization') rawToken : string,
  ){
    // email:password
    // nasjkfnqonqovqd[qpwd] -> email:password
    const token = this.authService.extractTokenFromHeader(rawToken,false);  

    const credentials = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(credentials);
  }

  @Post('register/email')
  postRegisterEmail(
    @Body('nickname')nickname:string,
    @Body('email') email:string,
    @Body('password',new MaxLengthPipe(8),new MinLengthPipe(3)) password:string,
  ){
    return this.authService.registerWithEmail({nickname,email,password});
  }


}
