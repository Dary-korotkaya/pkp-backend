import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Me = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
//   console.log(request.user);
  if (!request.user) {
    return null;
  }

  if (data) {
    return request.user[data];
  }
  return request.user;
});
