import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeormModule } from './typeorm/typeorm.module';
import { SupplierModule } from './supplier/supplier.module';
import { RequestModule } from './request/request.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { LogistModule } from './logist/logist.module';
import { ProductModule } from './product/product.module';
import { AuthMiddleware } from './user/middlewares/auth.middleware';

@Module({
  imports: [
    UserModule,
    TypeormModule,
    SupplierModule,
    RequestModule,
    AnalyticsModule,
    LogistModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
