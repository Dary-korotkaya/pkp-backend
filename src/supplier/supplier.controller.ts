import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { UserGuard } from '../user/guards/user.guard';
import { CreateSupplierDto } from './dtos/CreateSupplier.dto';
import { Role } from '../user/decorators/role.decorator';
import { Roles } from '../user/domain/roles.enum';
import { EditUserDto } from '../user/dtos/EditUser.dto';
import { Me } from '../user/decorators/Me.decorator';
import { Users } from '../user/user.entity';
import { EditSupplierDto } from './dtos/EditSupplier.dto';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post('create')
  @Role(Roles.LOGISTIC)
  @UseGuards(UserGuard)
  async createSupplier(@Body() dto: CreateSupplierDto) {
    const success = await this.supplierService.createSupplier(dto);
    return { success: success };
  }

  @Get('all')
  getAllSuppliers(): string {
    return this.supplierService.getAllSuppliers();
  }

  @Get('history')
  async getSupplierHistory() {
    return this.supplierService.getSuppliersHistory();
  }

  @Get(':id')
  getSupplierById(@Param('id') id: string): string {
    return this.supplierService.getSupplierById(id);
  }

  @Put('update')
  @Role(Roles.SUPPLIER)
  @UseGuards(UserGuard)
  async updateSupplier(@Me() user: Users, @Body() dto: EditSupplierDto) {
    const success = await this.supplierService.updateSupplier(user, dto);
    return { success: success };
  }
}
