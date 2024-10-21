import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { UserGuard } from '../user/guards/user.guard';
import { CreateSupplierDto } from './dtos/CreateSupplier.dto';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post('create')
  @UseGuards(UserGuard)
  createSupplier(@Body() dto: CreateSupplierDto): string {
    return this.supplierService.createSupplier(dto);
  }

  @Get('all')
  getAllSuppliers(): string {
    return this.supplierService.getAllSuppliers();
  }

  @Get(':id')
  getSupplierById(@Param('id') id: string): string {
    return this.supplierService.getSupplierById(id);
  }
}
