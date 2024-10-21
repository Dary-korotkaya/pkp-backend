import { Injectable } from '@nestjs/common';
import { Supplier } from './supplier.entity';

@Injectable()
export class SupplierService {
  private readonly suppliers: Supplier[] = [];

  deleteSupplier(supplierId: number): void {}

  updateSupplier(supplier: Supplier): void {
    // Логика обновления поставщика
  }

  supReplyToRequest(requestId: number, replyDetails: any): void {
    // Логика ответа на заявку от логиста
  }

  changeRequestStatus(requestId: number, status: string): void {
    // Логика изменения статуса заявки на поставку
  }

  viewRequestHistorySupplier(supplierId: number): any {
    // Логика просмотра истории заявок
  }

  addProductToCatalog(userId: number, productDetails: any): void {
    // Логика добавления товара в каталог
  }

    createSupplier(dto: CreateSupplierDto) {
        return '';
    }

    getAllSuppliers() {
        return '';
    }

    getSupplierById(id: string) {
        return '';
    }
}
