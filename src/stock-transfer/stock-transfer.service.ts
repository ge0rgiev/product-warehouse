import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreatePastImportInput } from './dto/create-past-import.input';
import { StockTransfer } from './entities/stock-transfer.entity';
import { CalculationApiService } from '../calculation/calculation-api.service';
import { Product } from '../product/entities/product.entity';
import { Inventory } from '../warehouse/entities/inventory.entity';
import { Warehouse } from '../warehouse/entities/warehouse.entity';
import { TransferStatus, TransferType } from './interface';
import { CreateFutureImportInput } from './dto/create-future-import.input';
import { StockRequest } from './entities/stock-request.entity';
import { CreateExportInput } from './dto/create-export.input';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class StockTransferService {
  constructor(
    private readonly calculationApiService: CalculationApiService,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async createPastImport(
    createPastImportInput: CreatePastImportInput,
    accessToken: string,
  ): Promise<StockTransfer> {
    this.calculationApiService.setToken(accessToken);
    await this.calculationApiService.importValidationChecks(
      createPastImportInput,
    );

    const { productId, warehouseId, units } = createPastImportInput;

    return await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const product = await transactionalEntityManager.findOneBy(Product, {
          id: productId,
        });

        const warehouse = await transactionalEntityManager.findOneBy(
          Warehouse,
          {
            id: warehouseId,
          },
        );

        const importAmount = units * product.sizePerUnit;

        let inventory = await transactionalEntityManager
          .createQueryBuilder(Inventory, 'inventory')
          .where('inventory.productId = :productId', { productId })
          .andWhere('inventory.warehouseId = :warehouseId', { warehouseId })
          .getOne();

        if (!inventory) {
          inventory = await transactionalEntityManager.create(Inventory, {
            warehouse,
            product,
            amount: 0,
          });
        }

        inventory.amount += importAmount;
        inventory = await transactionalEntityManager.save(inventory);

        // Update warehouse used space
        warehouse.usedCapacity += importAmount;
        await transactionalEntityManager.save(warehouse);

        const stockTransferEntity = await transactionalEntityManager.create(
          StockTransfer,
          {
            amount: importAmount,
            transferType: TransferType.IMPORT,
            inventory,
          },
        );

        return transactionalEntityManager.save(stockTransferEntity);
      },
    );
  }

  async createFutureImport(
    createFutureImportInput: CreateFutureImportInput,
    accessToken: string,
  ): Promise<StockTransfer> {
    // Call the Rest API for verification
    this.calculationApiService.setToken(accessToken);
    await this.calculationApiService.importValidationChecks(
      createFutureImportInput,
    );

    const { productId, warehouseId, units, scheduledAt } =
      createFutureImportInput;

    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const product = await transactionalEntityManager.findOneBy(Product, {
          id: productId,
        });

        const warehouse = await transactionalEntityManager.findOneBy(
          Warehouse,
          {
            id: warehouseId,
          },
        );

        const importAmount = units * product.sizePerUnit;

        // Update warehouse reserved space
        warehouse.reservedCapacity += importAmount;
        await transactionalEntityManager.save(warehouse);

        let inventory = await transactionalEntityManager
          .createQueryBuilder(Inventory, 'inventory')
          .where('inventory.productId = :productId', { productId })
          .andWhere('inventory.warehouseId = :warehouseId', { warehouseId })
          .getOne();

        if (!inventory) {
          inventory = await transactionalEntityManager.create(Inventory, {
            warehouse,
            product,
            amount: 0,
          });
          inventory = await transactionalEntityManager.save(inventory);
        }

        let stockRequest = await transactionalEntityManager.create(
          StockRequest,
          {
            scheduledAt,
          },
        );
        stockRequest = await transactionalEntityManager.save(stockRequest);

        const stockTransferEntity = await transactionalEntityManager.create(
          StockTransfer,
          {
            amount: importAmount,
            transferType: TransferType.IMPORT,
            status: TransferStatus.PENDING,
            inventory,
            stockRequest,
          },
        );

        return transactionalEntityManager.save(stockTransferEntity);
      },
    );
  }

  async createExport(
    createExportInput: CreateExportInput,
    accessToken: string,
  ): Promise<StockTransfer> {
    // Call the Rest API for verification
    this.calculationApiService.setToken(accessToken);
    await this.calculationApiService.exportValidationChecks(createExportInput);

    const { productId, warehouseId, amount } = createExportInput;

    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        let inventory = await transactionalEntityManager
          .createQueryBuilder(Inventory, 'inventory')
          .where('inventory.productId = :productId', { productId })
          .andWhere('inventory.warehouseId = :warehouseId', { warehouseId })
          .getOne();

        inventory.amount -= amount;
        await transactionalEntityManager.save(inventory);

        const warehouse = await transactionalEntityManager.findOneBy(
          Warehouse,
          {
            id: warehouseId,
          },
        );

        // Restore used space in the warehouse
        warehouse.usedCapacity -= amount;
        await transactionalEntityManager.save(warehouse);

        const stockTransferEntity = await transactionalEntityManager.create(
          StockTransfer,
          {
            amount,
            transferType: TransferType.EXPORT,
            status: TransferStatus.PAST,
            inventory,
          },
        );

        return transactionalEntityManager.save(stockTransferEntity);
      },
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_5PM)
  async handleFutureImports() {
    const stockRequests = await this.entityManager
      .createQueryBuilder(StockRequest, 'stockRequest')
      .where('stockRequest.scheduledAt > NOW()::DATE')
      .getMany();

    if (stockRequests.length > 0) {
      for (const stockRequest of stockRequests) {
        await this.executeFutureRequest(stockRequest as StockRequest);
      }
    }
  }

  // TODO: Match by StockRequest
  private async executeFutureRequest(
    stockRequest: StockRequest,
  ): Promise<StockTransfer> {
    console.log('Execute Future import', stockRequest.scheduledAt);
    const stockTransfer = await this.entityManager.findOneBy(StockTransfer, {
      status: TransferStatus.PENDING,
    });

    // Future request is Done
    stockTransfer.status = TransferStatus.DONE;

    // Add the amount to the invertory
    stockTransfer.inventory.amount += stockTransfer.amount;

    // Deduct the reserved space and add to the used
    stockTransfer.inventory.warehouse.reservedCapacity -= stockTransfer.amount;
    stockTransfer.inventory.warehouse.usedCapacity += stockTransfer.amount;

    return this.entityManager.save(stockTransfer);
  }
}
