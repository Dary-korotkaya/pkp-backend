import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EditUserDto } from '../../user/dtos/EditUser.dto';

export class EditSupplierDto extends EditUserDto {
  @IsOptional()
  @IsString()
  companyAddress?: string;

  @IsOptional()
  @IsString()
  companyName?: string;
}
