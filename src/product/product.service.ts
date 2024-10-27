import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { ProductType, Supplier } from '../supplier/supplier.entity';
import { CreateProductDto } from './dtos/CreateProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async createProduct(
    supplier: Supplier,
    dto: CreateProductDto,
  ): Promise<boolean> {
    console.log(dto);
    await this.productRepository.save({
      ...dto,
      supplier: supplier,
      type: supplier.productType,
    });
    return true;
  }

  async listProducts(type: ProductType) {
    const query = this.productRepository.createQueryBuilder('product');

    if (type) {
      query.where('product.type = :type', { type });
    }

    return query.getMany();
  }

  async updateProduct(supplier: Supplier, id: string, dto: CreateProductDto) {
    const product = await this.productRepository.findOneBy({ id: id });
    if (!product || product.supplier.id !== supplier.id) {
      throw new NotFoundException('Product not found');
    }
    await this.productRepository.save({ ...product, ...dto });

    return true;
  }
}
