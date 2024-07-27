import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { Config } from './config';
import secureSession from '@fastify/secure-session';
import { User } from './users/users.service';

declare module '@fastify/secure-session' {
  interface SessionData {
    user: Omit<User, 'password'>;
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  app.enableCors({ origin: 'http://localhost:5173', credentials: true });
  const configService = app.get(ConfigService<Config, true>);
  await app.register(secureSession, {
    secret: 'secretsecretsecretsecretsecretsecret',
    salt: 'saltysaltysaltys',
    cookie: {
      sameSite: 'none',
      secure: true,
    },
  });
  await app.listen(configService.get('port'));
}
bootstrap();
