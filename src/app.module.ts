import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeormModule } from './typeorm/typeorm.module';
import { SupplierModule } from './supplier/supplier.module';
import { RequestModule } from './request/request.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { LogistModule } from './logist/logist.module';

@Module({
  imports: [
    UserModule,
    TypeormModule,
    SupplierModule,
    RequestModule,
    AnalyticsModule,
    LogistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
