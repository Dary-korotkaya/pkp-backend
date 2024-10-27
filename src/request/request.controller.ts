import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { UserGuard } from '../user/guards/user.guard';
import { Role } from '../user/decorators/role.decorator';
import { Roles } from '../user/domain/roles.enum';
import { CreateRequestDto } from './dtos/CreateRequest.dto';
import { Me } from '../user/decorators/Me.decorator';
import { Logist } from '../logist/logist.entity';
import { ReplyDto } from './dtos/Reply.dto';
import { ChangeStatusDto } from './dtos/ChangeStatus.dto';

@Controller('request')
@UseGuards(UserGuard)
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post('create')
  @Role(Roles.LOGISTIC)
  create(
    @Me('logist') logist: Logist,
    @Body() createRequestDto: CreateRequestDto,
  ) {
    return this.requestService.create(logist.id, createRequestDto);
  }

  @Post('reply/:requestId')
  @Role(Roles.SUPPLIER)
  async replyToRequest(
    @Me('supplier') supplier,
    @Body() replyDetails: ReplyDto,
    @Param('requestId') requestId: string,
  ) {
    return this.requestService.supReplyToRequest(
      requestId,
      supplier.id,
      replyDetails,
    );
  }

  @Post('change-status/:requestId')
  @Role(Roles.SUPPLIER)
  async changeRequestStatus(
    @Param('requestId') requestId: string,
    @Body('status') status: ChangeStatusDto,
  ) {
    const success = await this.requestService.changeRequestStatus(
      requestId,
      status,
    );
    return { success };
  }

  @Post('confirm/:requestId')
  @Role(Roles.LOGISTIC)
  async confirmRequest(
    @Me('logist') logist: Logist,
    @Param('requestId') requestId: string,
  ) {
    const success = await this.requestService.confirmRequest(
      logist.id,
      requestId,
    );
    return { success };
  }

  @Get('all/current')
  @Role(Roles.LOGISTIC)
  async getAllCurrentRequests(
    @Me('logist') logist: Logist,
    @Query('sortByPrice') sortByPrice: 'asc' | 'desc',
  ) {
    return this.requestService.getAllCurrentRequests(logist.id, sortByPrice);
  }

  @Get('statistics')
  async getRequestsSuppliers() {
    return this.requestService.getRequestsSuppliers();
  }

  @Get('finance-chart')
  async getFinanceChartData() {
    return this.requestService.getFinanceChartData();
  }

  @Get(':id')
  @Role(Roles.LOGISTIC)
  async getRequestById(@Param('id') id: string) {
    try {
      return await this.requestService.findOne(id);
    } catch {
      throw new NotFoundException(`Request with id: ${id} not found`);
    }
  }

  @Get('all/history')
  async getAllHistoryRequests() {
    return this.requestService.getAllHistoryRequests();
  }

  @Get('completed/history')
  async getCompletedHistoryRequests() {
    return this.requestService.getHistoryOfOperations();
  }
}
