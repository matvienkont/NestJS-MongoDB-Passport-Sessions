import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import fastifyCookie from '@fastify/cookie';
import cfg from './config';
import session from 'express-session';
import passport from 'passport';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule/*, new FastifyAdapter()*/);

    app.use(cookieParser());
    app.use(session({
        secret: cfg.sessionKey,
        // resave: false,
        store: MongoStore.create({
            client: mongoose.connection.getClient(),
            mongoUrl: `mongodb://${cfg.mongoUsername}:${cfg.mongoPassword}@${cfg.mongoHost}:${cfg.mongoPort}/${cfg.mongoDatabase}`
        }),
        cookie: {
            maxAge: 365 * 24 * 60 * 60 * 1000,
            secure: false,
        }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    const reflector = app.get(Reflector);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

    await app.listen(3000);
}
bootstrap();