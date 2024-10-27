import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRequestDto } from './dtos/CreateRequest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Request, RequestStatus } from './request.entity';
import { LogistService } from '../logist/logist.service';
import { Product } from '../product/product.entity';
import { SupplierService } from '../supplier/supplier.service';
import { ReplyDto } from './dtos/Reply.dto';
import { ChangeStatusDto } from './dtos/ChangeStatus.dto';
import { RequestProductInfo } from './RequestProductInfo.entity';
import { ProductType, Supplier } from '../supplier/supplier.entity';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request) private requestRepository: Repository<Request>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private readonly logistService: LogistService,
    @InjectRepository(RequestProductInfo)
    private requestProductInfo: Repository<RequestProductInfo>,
    private readonly supplierService: SupplierService,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async create(logistId: string, createRequestDto: CreateRequestDto) {
    const logist = await this.logistService.findOne(logistId);

    const productIds = createRequestDto.productInfo.map(
      (info) => info.productId,
    );
    const products = await this.productRepository.find({
      where: {
        id: In(productIds),
      },
      relations: ['supplier'], // Убедитесь, что связь supplier определена в сущности Product
    });

    const supplierIds = new Set(products.map((product) => product.supplier.id));
    if (supplierIds.size !== 1) {
      throw new Error('All products must have the same supplier');
    }

    const supplier = await this.supplierService.getById(
      Array.from(supplierIds)[0],
    );

    const request = this.requestRepository.create({
      ...createRequestDto,
      logist: logist,
      supplier: supplier,
      productType: supplier.productType,
    });

    const createdRequest = await this.requestRepository.save(request);

    // Создание и сохранение всех productInfo
    const requestProductInfos = products.map((product, i) => {
      const requestProductInfo = new RequestProductInfo();
      requestProductInfo.request = createdRequest;
      requestProductInfo.product = product;
      requestProductInfo.quantity = createRequestDto.productInfo[i].quantity;
      return requestProductInfo;
    });

    await this.requestProductInfo.save(requestProductInfos);

    return createdRequest;
  }

  async supReplyToRequest(
    requestId: string,
    supplierId: string,
    replyDetails: ReplyDto,
  ) {
    const request = await this.requestRepository.findOne({
      where: { id: requestId },
      relations: { supplier: true },
    });
    if (!request) {
      throw new NotFoundException('Request not found');
    }
    if (request.supplier.id !== supplierId) {
      throw new ConflictException('This supplier cannot reply to this request');
    }
    if (request.status !== RequestStatus.IN_PROCESS) {
      throw new ConflictException('Request is not in process');
    }
    const newStatus = replyDetails.confirm
      ? RequestStatus.CONFIRMED
      : RequestStatus.REJECTED;
    const result = await this.requestRepository.update(
      { id: requestId },
      {
        status: newStatus,
      },
    );
    if (result.affected === 0) {
      throw new ConflictException('Failed to update request');
    }

    return {
      newStatus: newStatus,
    };
  }

  async findOne(id: string): Promise<Request> {
    const request = this.requestRepository.findOne({
      where: { id: id },
      relations: ['logist', 'supplier'],
    });
    if (!request) {
      throw new NotFoundException('Request not found');
    }
    return request;
  }

  async changeRequestStatus(requestId: string, status: ChangeStatusDto) {
    const request = await this.findOne(requestId);

    if (request.status >= status.status) {
      throw new ConflictException(
        'Cannot move to a previous or the same status',
      );
    }

    if (status.status - request.status > 1) {
      throw new ConflictException('Can only move to the next status');
    }

    request.status = status.status;
    await this.requestRepository.save(request);
    return true;
  }

  async confirmRequest(logistId: string, requestId: string) {
    const logist = await this.logistService.findOne(logistId);
    const request = await this.findOne(requestId);

    if (request.logist.id === logist.id) {
      throw new ConflictException('This logist cannot confirm this request');
    }

    request.status = RequestStatus.COMPLETED;
    await this.requestRepository.save(request);
    return true;
  }

  async getAllCurrentRequests(
    logisticId: string,
    sortByPrice: 'asc' | 'desc',
  ): Promise<any[]> {
    const requests = await this.requestRepository.find({
      where: {
        logist: { id: logisticId },
        status: Not(RequestStatus.COMPLETED),
      },
      relations: ['productInfo', 'productInfo.product'],
    });

    const requestsWithTotalPrice = requests.map((request) => {
      const totalPrice = request.productInfo.reduce(
        (sum, productInfo) =>
          sum + productInfo.product.price * productInfo.quantity,
        0,
      );
      return {
        ...request,
        totalPrice: totalPrice.toFixed(2),
      };
    });

    if (sortByPrice) {
      requestsWithTotalPrice.sort((a, b) =>
        sortByPrice === 'asc'
          ? parseFloat(a.totalPrice) - parseFloat(b.totalPrice)
          : parseFloat(b.totalPrice) - parseFloat(a.totalPrice),
      );
    }

    return requestsWithTotalPrice.map((request) => {
      return {
        id: request.id,
        endpoint: request.addressOfDelivery,
        category: request.productType,
        status: request.status,
        totalPrice: request.totalPrice,
      };
    });
  }

  async getAllHistoryRequests() {
    const historyRequests = await this.requestRepository.find({
      relations: [
        'productInfo',
        'productInfo.product',
        'supplier',
        'supplier.user',
      ],
    });

    if (!historyRequests) {
      throw new NotFoundException('No history requests found');
    }

    const formattedHistoryRequests = [];

    for (const request of historyRequests) {
      let totalQuantity = 0;
      let totalPrice = 0;
      for (const productInfo of request.productInfo) {
        const product = await this.productRepository.findOne({
          where: {
            id: productInfo.product.id,
          },
        });

        totalQuantity += productInfo.quantity;
        totalPrice += product.price * productInfo.quantity;
      }

      formattedHistoryRequests.push({
        id: request.id,
        supplierName: request.supplier.user.fullName,
        date: request.dateOfDelivery.toISOString(),
        category: request.productType,
        numberOfItems: request.productInfo.length,
        totalQuantity,
        totalPrice: totalPrice.toFixed(2),
      });
    }

    return formattedHistoryRequests;
  }

  async getRequestsSuppliers() {
    const totalRequests = await this.requestRepository.count();
    const totalSuppliers = await this.supplierRepository.count();
    const completedRequests = await this.requestRepository.count({
      where: { status: RequestStatus.COMPLETED },
    });
    const incompletedRequests = totalRequests - completedRequests;
    const averageCompleted = totalRequests
      ? completedRequests / totalRequests
      : 0;

    const categoryData = [];
    for (const type in ProductType) {
      const total = await this.requestRepository.count({
        where: { productType: ProductType[type] },
      });
      categoryData.push({ category: ProductType[type], total });
    }

    return {
      totalRequests,
      totalSuppliers,
      completedRequests,
      incompletedRequests,
      averageCompleted,
      categoryData,
    };
  }

  async getFinanceChartData() {
    const requests = await this.requestRepository.find({
      relations: ['productInfo', 'productInfo.product'],
    });
    const financeChartData = [];
    let total = 0;

    for (const type in ProductType) {
      const requestsByType = requests.filter(
        (request) => request.productType === ProductType[type],
      );
      let amount = 0;

      for (const request of requestsByType) {
        for (const productInfo of request.productInfo) {
          amount += productInfo.product.price * productInfo.quantity;
        }
      }

      financeChartData.push({ category: ProductType[type], amount });
      total += amount;
    }

    return {
      data: financeChartData,
      total,
    };
  }

  async getHistoryOfOperations() {
    const requests = await this.requestRepository.find({
      relations: [
        'supplier',
        'supplier.user',
        'productInfo',
        'productInfo.product',
      ],
      where: { status: RequestStatus.COMPLETED },
    });
    const operations = requests.map((request) => {
      const totalPrice = request.productInfo.reduce(
        (sum, productInfo) =>
          sum + productInfo.product.price * productInfo.quantity,
        0,
      );
      return {
        id: request.id,
        supplier: request.supplier.user.fullName,
        date: request.dateOfDelivery.toISOString(),
        totalPrice: totalPrice.toFixed(2),
      };
    });

    return {
      operations,
    };
  }
}
