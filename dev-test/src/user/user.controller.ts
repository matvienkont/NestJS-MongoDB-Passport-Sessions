import { Body, Controller, Post, UseInterceptors, UseGuards, Res, Get, Req, HttpStatus } from "@nestjs/common";
import { UsersService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { PasswordHinter } from "../auth/providers/password-assist.provider";
import { SanitizeMongooseModelInterceptor } from "nestjs-mongoose-exclude";
import { User } from "./user.entity";
import { GetUser } from "./users.decorator";
import { LocalAuthGuard } from "../auth/guards/local.guard";
import { AuthenticatedGuard } from "src/auth/guards/authenticated.guard";
import { ChangePasswordDto } from "./dto/change-password.dto";
import RequestWithUser from "./requestWithUser.interface";
import { Request, Response } from "express";

@UseInterceptors(new SanitizeMongooseModelInterceptor())
@Controller()
export class UsersController {
    constructor (private readonly usersServices: UsersService) {}

    @Post('user')
    async create(@Body() createUserDto: CreateUserDto) {
        const { password } = createUserDto;
        const user = await this.usersServices.create(createUserDto);
        return { user, passwordScore: PasswordHinter.evaluatePassword(password) };
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Req() req: Request) {
        return {
            user: req.user,
            msg: 'User logged in'
        };
    }

    @UseGuards(AuthenticatedGuard)
    @Post('/change-password')
    async changePassword(@Req() req: RequestWithUser, @Body() changePasswordDto: ChangePasswordDto, @GetUser('email') email: string) {
        const { newPassword } = changePasswordDto;
        await this.usersServices.changePassword(email, changePasswordDto);
        this.usersServices.logOutUser(req);
        return { msg: 'Password updated', passwordScore: PasswordHinter.evaluatePassword(newPassword) };
    }

    @UseGuards(AuthenticatedGuard)
    @Get('/logout')
    logout(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response) {
        this.usersServices.logOutUser(req);
        return { msg: 'The user session has ended' };
    }
}