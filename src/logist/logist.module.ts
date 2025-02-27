import { Module } from '@nestjs/common';
import { LogistController } from './logist.controller';
import { LogistService } from './logist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logist } from './logist.entity';
import { Users } from '../user/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Logist]), UserModule],
  controllers: [LogistController],
  providers: [LogistService],
})
export class LogistModule {}
