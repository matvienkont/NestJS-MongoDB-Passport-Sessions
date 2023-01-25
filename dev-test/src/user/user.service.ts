import { HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, forwardRef } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.entity';
import { Model } from 'mongoose';
import { MongoErrorCodes } from '../constants';
import { Exclude } from 'class-transformer';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import RequestWithUser from './requestWithUser.interface';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService
    ) {}

    async findOneByEmail(email: string): Promise<UserDocument | undefined> {
        const user = await this.userModel.findOne({ email });
        if (!user) {
            return undefined;
        }
        return user;
    }

    async create(userDto: CreateUserDto) {
        let { username: email, password } = userDto;
        email = email.toLowerCase();

        const isValidEmail = this.validateEmail(email);
        if (!isValidEmail) {
            const errors = { email: 'Email is of invalid format' };
            throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.BAD_REQUEST);
        }

        let user: UserDocument | undefined;
        try {
            user = new this.userModel({ email, password });
            await user.save();
        } catch (err) {
            if (err.code === MongoErrorCodes.duplicate) {
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Email with this user already exists',
                }, HttpStatus.BAD_REQUEST);
            } else {
                console.log(err);
                throw new InternalServerErrorException();
            }
        }

        return user;
    }

    async changePassword(email: string, changePasswordDto: ChangePasswordDto) {
        const { oldPassword, newPassword } = changePasswordDto;
        const validatedUser = await this.authService.validateUser({ username: email, password: oldPassword });
        if (validatedUser) {
            validatedUser.password = newPassword;
            await validatedUser.save();
        }
    }

    validateEmail(email: string) {
        return String(email)
            .toLowerCase()
            .match(
                // RFC 2822
                /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
    }

    logOutUser(req: RequestWithUser) {
        req.logOut({}, err => console.log('Error loggin out', err, req.user));
        req.session.cookie.maxAge = 0;
    }
}
