import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Users } from './user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { EditUserDto } from './dtos/EditUser.dto';
import { log } from 'console';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}

  async updateUser(id: string, userDto: EditUserDto): Promise<boolean> {
    let user = await this.userRepository.findOneBy({ id: id });

    if (!user) {
      return false;
    }
    user = { ...user, ...userDto };

    await this.userRepository.save(user);

    return true;
  }

  async authenticateUser(login: string, password: string): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: { login: login },
      relations: { supplier: true, logist: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // const isPasswordMatching = await bcrypt.compare(password, user.password);
    const isPasswordMatching = password === user.password;
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async findById(id: string): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: { supplier: true, logist: true },
    });

    if (!user) {
      throw new NotFoundException(`Users with ID ${id} not found`);
    }

    return user;
  }

  createToken(user: Users): string {
    let role = 'user';

    if (user.supplier) {
      role = 'supplier';
    } else if (user.logist) {
      role = 'logistic';
    }

    const payload = { userId: user.id, role };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
  }

  verifyToken(token: string, key: string): JwtPayload {
    try {
      return jwt.verify(token, key) as JwtPayload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async createUser(dto: Partial<Users>): Promise<Users> {
    const existingUser = await this.userRepository.findOne({
      where: [{ phoneNumber: dto.phoneNumber }, { email: dto.email }],
    });

    if (existingUser) {
      throw new ConflictException(
        'Users with this email or phone number already exists',
      );
    }

    // dto.password = await this.hashPassword(dto.password);

    return this.userRepository.save(dto);
  }
}
