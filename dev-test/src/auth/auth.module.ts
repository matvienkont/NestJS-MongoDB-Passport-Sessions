import { MiddlewareConsumer, Module, NestModule, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PasswordHinter } from './providers/password-assist.provider';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './session.serializer';

@Module({
    imports: [forwardRef(() => UserModule), PassportModule.register({ session: false })],
    providers: [AuthService, LocalStrategy, SessionSerializer],
    controllers: [],
})
export class AuthModule {}