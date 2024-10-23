import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestProductInfo } from './RequestProductInfo.entity';
import { Request } from './Request.entity';
import { UserModule } from '../user/user.module';
import { LogistModule } from '../logist/logist.module';
import { Product } from '../product/product.entity';
import { LogistService } from 'src/logist/logist.service';
import { SupplierService } from 'src/supplier/supplier.service';
import { Logist } from 'src/logist/logist.entity';
import { Supplier } from 'src/supplier/supplier.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Request,
      RequestProductInfo,
      Product,
      Logist,
      Supplier,
    ]),
    UserModule,
    LogistModule,
  ],
  controllers: [RequestController],
  providers: [RequestService, LogistService, SupplierService],
})
export class RequestModule {}
