import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Res,
  UnauthorizedException, UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Me } from './decorators/Me.decorator';
import { Users } from './user.entity';
import { UserGuard } from './guards/user.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('auth')
  async authenticate(
    @Body('login') login: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response,
  ) {
    try {
      const user = await this.userService.authenticateUser(login, password);

      const token = this.userService.createToken(user);

      response.cookie('token', token, { httpOnly: true });

      return { user, token };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw error;
    }
  }

  @Get('/me')
  @UseGuards(UserGuard)
  async me(@Me() user: Users) {
    return user;
  }

  @Get(':id')
  async findUserById(@Param('id') id: string) {
    try {
      const user = await this.userService.findById(id);

      return user;
    } catch (error) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }
  }


}
