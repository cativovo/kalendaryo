import { Injectable } from '@nestjs/common';

export type User = {
  id: string;
  username: string;
  password: string;
};

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: '1',
      username: 'admin',
      password: 'admin',
    },
    {
      id: '2',
      username: 'user1',
      password: 'user1',
    },
    {
      id: '3',
      username: 'user2',
      password: 'user2',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    const user = this.users.find((v) => v.username === username);

    if (!user) {
      return undefined;
    }

    return { ...user };
  }
}
