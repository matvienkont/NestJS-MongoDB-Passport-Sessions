
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
    const funcName = '[Decorator.GetUser]';
    const req = ctx.switchToHttp().getRequest();

    if (req.user) {
        return data ? req.user[data] : req.user;
    } else {
        throw new UnauthorizedException({ msg: `${funcName} User session is not established` });
    }
});