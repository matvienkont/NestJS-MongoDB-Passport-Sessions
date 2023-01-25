import { Inject, Injectable, NotAcceptableException, forwardRef } from "@nestjs/common";
import { AuthProvider } from "./providers/auth-hashing.provider";
import { LoginUserDto } from "../user/dto/login-user.dto";
import { UsersService } from "../user/user.service";
// import { UsersService } from '../users/users.service';
// import { LoginUserDto } from '../users/dto/login-user.dto';
// import { AuthProvider } from './providers/auth-hashing.provider';
// import { JwtService } from "@nestjs/jwt";
// import { UserEntity } from "src/users/users.entity";

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
    ) {}

    async validateUser({ username: email, password }: LoginUserDto) {
        const user = await this.usersService.findOneByEmail(email);
        const isPasswordMatch = await AuthProvider.comparePasswords(password, user.password);
        if (!user) {
            throw new NotAcceptableException('Could not find the user');
        }
        return isPasswordMatch ? user : undefined;
    }

    // async login(user: UserEntity) {
    //     const payload = { email: user.email, id: user.id };
    //     return {
    //         access_token: this.jwtService.sign(payload),
    //     };
    // }

    // async logout(user: UserEntity) {
    //     const payload = { email: user.email, id: user.id };
    //     return {
    //         access_token: this.jwtService.sign(payload, { expiresIn: '0s' }),
    //     };
    // }
}