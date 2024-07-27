import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async login(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findOne(username);

    if (user?.password !== password) {
      throw new UnauthorizedException();
    }

    delete (user as Partial<User>).password;

    return user;
  }
}
