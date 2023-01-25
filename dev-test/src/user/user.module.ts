import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.entity';
import { PasswordHinter } from '../auth/providers/password-assist.provider';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        forwardRef(() => AuthModule)
    ],
    providers: [UsersService, PasswordHinter, AuthService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UserModule {}
