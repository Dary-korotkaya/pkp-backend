import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('role', context.getHandler());

    const request = context.switchToHttp().getRequest();
    const token = request.cookies['token'];
    console.log(token);
    try {
      const decoded = this.userService.verifyToken(
        token,
        process.env.JWT_SECRET,
      );
      if (!roles) {
        return true;
      }
      const userRole = decoded.role;
      return roles.includes(userRole);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
