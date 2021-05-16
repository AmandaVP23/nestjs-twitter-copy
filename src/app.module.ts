import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { AuthenticationModule } from './authentication/authentication.module';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TweetsModule } from './tweets/tweets.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { FollowModule } from './follow/follow.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(typeORMConfig),
        ServeStaticModule.forRoot({
            rootPath: path.join(__dirname, '..', 'uploads'),
            serveRoot: '/public',
        }),
        MailerModule.forRoot({
            transport: {
                host: '127.0.0.1',
                port: 1025,
                secure: false,
                auth: {
                    user: "username",
                    pass: "password"
                }
            },
            defaults: {
                from: '"nest-modules" <modules@nestjs.com',
            },
            template: {
                dir: path.resolve(__dirname, 'templates'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
        AuthenticationModule,
        TweetsModule,
        UsersModule,
        FollowModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
