import {
  Body,
  Controller, Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { UserGuard } from '../user/guards/user.guard';
import { Roles } from '../user/domain/roles.enum';
import { Role } from '../user/decorators/role.decorator';
import { Me } from '../user/decorators/Me.decorator';
import { ProductType, Supplier } from '../supplier/supplier.entity';
import { CreateProductDto } from './dtos/CreateProduct.dto';
import { UpdateProductDto } from './dtos/UpdateProduct.dto';

@Controller('product')
@UseGuards(UserGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @Role(Roles.SUPPLIER)
  async createProduct(
    @Me('supplier') user: Supplier,
    @Body() dto: CreateProductDto,
  ) {
    const success = await this.productService.createProduct(user, dto);
    return { success: success };
  }

  @Get('list')
  async listProducts(@Query('type') type: ProductType) {
    return await this.productService.listProducts(type);
  }

  @Put('update/:id')
  @Role(Roles.SUPPLIER)
  async updateProduct(
    @Me('supplier') supplier: Supplier,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    const success = await this.productService.updateProduct(supplier, id, dto);
    return { success: success };
  }

  @Get('/my')
  @Role(Roles.SUPPLIER)
  async getMyProducts(@Me('supplier') supplier: Supplier) {
    return await this.productService.getMyProducts(supplier);
  }

  @Delete('delete/:id')
  @Role(Roles.SUPPLIER)
  async deleteProduct(
    @Param('id') id: string,
  ) {
    const success = await this.productService.deleteProduct(id);
    return { success: success };
  }
}
