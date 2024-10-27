import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { ProductType } from '../supplier.entity';
import { CreateUserDto } from '../../user/dtos/CreateUserDto';

export class CreateSupplierDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  companyAddress: string;

  @IsString()
  companyName: string;

  @IsEnum(ProductType)
  productType: ProductType;
}
