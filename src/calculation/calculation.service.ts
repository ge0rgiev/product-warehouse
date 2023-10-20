import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ImportDto } from './dto/import.dto';
import { Product } from '../product/entities/product.entity';
import { Warehouse } from '../warehouse/entities/warehouse.entity';
import { User } from '../user/entities/user.entity';
import { ExportDto } from './dto/export.dto';
import { Inventory } from '../warehouse/entities/inventory.entity';

@Injectable()
export class CalculationService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async inventoryOwnership(
    { productId, warehouseId }: ImportDto | ExportDto,
    userId: number,
  ): Promise<boolean> {
    const userCount = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('product', 'product', 'product.createdById = user.id')
      .leftJoinAndSelect(
        'warehouse',
        'warehouse',
        'warehouse.supervisorId = user.id',
      )
      .where('product.id = :productId', { productId })
      .andWhere('product.deletedAt IS NULL')
      .andWhere('warehouse.id = :warehouseId', { warehouseId })
      .andWhere('user.id = :userId', { userId })
      .getCount();

    return userCount === 1;
  }

  async getProduct(productId: number): Promise<Product> {
    return this.dataSource
      .getRepository(Product)
      .createQueryBuilder('product')
      .where('product.id = :productId', { productId })
      .getOne();
  }

  async getWarehouse(warehouseId: number): Promise<Warehouse> {
    return this.dataSource
      .getRepository(Warehouse)
      .createQueryBuilder('warehouse')
      .where('warehouse.id = :warehouseId', { warehouseId })
      .getOne();
  }

  async getInventory(
    productId: number,
    warehouseId: number,
  ): Promise<Inventory> {
    return this.dataSource
      .getRepository(Inventory)
      .createQueryBuilder('inventory')
      .where('inventory.productId = :productId', { productId })
      .andWhere('inventory.warehouseId = :warehouseId', { warehouseId })
      .getOne();
  }
}
