import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import * as process from 'process';
import { join } from 'path';
import { Logist } from 'src/logist/logist.entity';
import { Request } from 'src/request/request.entity';
import { Supplier } from 'src/supplier/supplier.entity';
import { Product } from 'src/product/product.entity';
import { RequestProductInfo } from 'src/request/RequestProductInfo.entity';
import { User } from 'src/user/user.entity';

config({ path: join(process.cwd(), '.env') });
const configService = new ConfigService();

const options = (): DataSourceOptions => {
  const url = configService.get<string>('DATABASE_URL');
  if (!url) {
    throw new Error('Database url not found');
  }
  console.log('Connecting to DB with URL:', url); // Debugging line to ensure correct URL
  return {
    url: url,
    type: 'postgres',
    logging: false,
    entities: [User, Logist, Request, Supplier, Product, RequestProductInfo],
    migrations: ['dist/migrations/*.{ts,js}'],
    synchronize: true,
  };
};

export const appDataSource = new DataSource(options());
export default options;
