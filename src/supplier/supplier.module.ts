import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './supplier.entity';
import { UserModule } from '../user/user.module';
import { Request } from '../request/request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier, Request]), UserModule],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
