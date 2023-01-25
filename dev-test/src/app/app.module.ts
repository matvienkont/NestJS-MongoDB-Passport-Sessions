import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import cfg from '../config';
import { UserModule } from '../user/user.module';
import { PasswordHinter } from '../auth/providers/password-assist.provider';
import { AuthModule } from 'src/auth/auth.module';
import session from 'express-session';
import { session as passportSession, initialize as passportInitialize } from 'passport';
import { AuthService } from 'src/auth/auth.service';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

@Module({
    imports: [
        MongooseModule.forRoot(`mongodb://${cfg.mongoUsername}:${cfg.mongoPassword}@${cfg.mongoHost}:${cfg.mongoPort}/${cfg.mongoDatabase}`),
        UserModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService, AuthService],
})
export class AppModule {}
