import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Supplier } from './supplier.entity';
import { CreateSupplierDto } from './dtos/CreateSupplier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { Users } from '../user/user.entity';
import { EditSupplierDto } from './dtos/EditSupplier.dto';
import { Request, RequestStatus } from '../request/request.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
    private readonly userService: UserService,
  ) {}

  async updateSupplier(
    user: Users,
    supplierDto: EditSupplierDto,
  ): Promise<boolean> {
    let supplier = await this.supplierRepository.findOneBy({
      user: { id: user.id },
    });

    if (!supplier) {
      return false;
    }

    await this.userService.updateUser(user.id, supplierDto);

    supplier = { ...supplier, ...supplierDto };
    await this.supplierRepository.save(supplier);
    return true;
  }

  getAllSuppliers(): any {
    return this.supplierRepository
      .find({ relations: ['user'] })
      .then((suppliers) => {
        if (!suppliers) {
          return [];
        }
        return suppliers.map((supplier) => ({
          id: supplier.id,
          fullName: supplier.user.fullName,
          phoneNumber: supplier.user.phoneNumber,
          email: supplier.user.email,
        }));
      });
  }

  getSupplierById(id: string): any {
    const supplier = this.supplierRepository.findOneBy({ id: id });
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }
    return supplier;
  }

  async createSupplier(dto: CreateSupplierDto) {
    const supplierWithType = await this.supplierRepository.findOneBy({
      productType: dto.productType,
    });
    if (supplierWithType) {
      throw new ConflictException(
        'Supplier with such product type already exists',
      );
    }
    const user: Users = await this.userService.createUser(dto);

    const supplier = new Supplier();
    supplier.companyAddress = dto.companyAddress;
    supplier.companyName = dto.companyName;
    supplier.productType = dto.productType;
    supplier.user = user;
    await this.supplierRepository.save(supplier);

    return true;
  }

  async getById(id: string) {
    const supplier = this.supplierRepository.findOneBy({ id: id });
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }
    return supplier;
  }

  async getSuppliersHistory() {
    const suppliers = await this.supplierRepository.find({
      relations: { user: true },
    });

    if (!suppliers) {
      throw new NotFoundException('No suppliers found');
    }

    const suppliersHistory = [];

    for (const supplier of suppliers) {
      const completedRequests = await this.requestRepository.count({
        where: { supplier, status: RequestStatus.COMPLETED },
      });

      const uncompletedRequests = await this.requestRepository.count({
        where: { supplier, status: Not(RequestStatus.COMPLETED) },
      });

      suppliersHistory.push({
        id: supplier.id,
        supplierName: supplier.user.fullName,
        contactNumber: supplier.user.phoneNumber,
        email: supplier.user.email,
        category: supplier.productType,
        completedRequests,
        uncompletedRequests,
      });
    }

    return suppliersHistory;
  }
}
