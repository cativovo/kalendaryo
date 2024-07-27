import { Session as FastifySession } from '@fastify/secure-session';
import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/zod';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body(new ZodValidationPipe(LoginDto)) loginDto: LoginDto,
    @Session() session: FastifySession,
  ) {
    const user = await this.authService.login(
      loginDto.username,
      loginDto.password,
    );
    session.set('user', user);

    return user;
  }

  @Get('me')
  async me(@Session() session: FastifySession) {
    const user = session.get('user');

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
