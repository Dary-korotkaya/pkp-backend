import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from '../user.service';
import { NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req, _: Response, next: NextFunction) {
    // console.log(req.cookies);

    if (!req.cookies['token']) {
      req.user = null;
      next();
      return;
    }

    const token = req.cookies['token'];
    // console.log(token);

    try {
      const decode = this.userService.verifyToken(
        token,
        process.env.JWT_SECRET,
      );
      req.user = await this.userService.findById(decode.userId);
      next();
    } catch (err) {
      req.user = null;
      next();
    }
  }
}
