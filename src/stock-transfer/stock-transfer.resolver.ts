import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { JwtAuthGuard } from '../shared/guard/jwt-auth.guard';
import { StockTransfer } from './entities/stock-transfer.entity';
import { StockTransferService } from './stock-transfer.service';
import { AccessToken } from '../shared/decorator/access-token.decorator';
import { CreatePastImportInput } from './dto/create-past-import.input';
import { CreateFutureImportInput } from './dto/create-future-import.input';
import { CreateExportInput } from './dto/create-export.input';

@Resolver(() => StockTransfer)
@UseGuards(JwtAuthGuard)
export class StockTransferResolver {
  constructor(private readonly stockTransferService: StockTransferService) {}

  @Mutation(() => StockTransfer, { name: 'CreatePastImport' })
  async createPastImport(
    @Args('createPastImportInput') createPastImportInput: CreatePastImportInput,
    @AccessToken() accessToken: string,
  ): Promise<StockTransfer> {
    return this.stockTransferService.createPastImport(
      createPastImportInput,
      accessToken,
    );
  }

  @Mutation(() => StockTransfer, { name: 'CreateFutureImport' })
  async createFutureImport(
    @Args('createFutureImportInput')
    createFutureImportInput: CreateFutureImportInput,
    @AccessToken() accessToken: string,
  ): Promise<StockTransfer> {
    return this.stockTransferService.createFutureImport(
      createFutureImportInput,
      accessToken,
    );
  }

  @Mutation(() => StockTransfer, { name: 'CreateExport' })
  async createExport(
    @Args('createExportInput')
    createExportInput: CreateExportInput,
    @AccessToken() accessToken: string,
  ): Promise<StockTransfer> {
    return this.stockTransferService.createExport(
      createExportInput,
      accessToken,
    );
  }
}
