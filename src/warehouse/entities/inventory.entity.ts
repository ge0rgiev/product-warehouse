import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { Product } from '../../product/entities/product.entity';
import { StockTransfer } from '../../stock-transfer/entities/stock-transfer.entity';
import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { FilterableField, IDField } from '@nestjs-query/query-graphql';

@Entity()
@ObjectType()
export class Inventory {
  @PrimaryGeneratedColumn()
  @IDField(() => ID)
  id: number;

  @Column({ default: 0 })
  @FilterableField(() => Int)
  amount: number;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.inventories, {
    nullable: false,
  })
  @FilterableField(() => Warehouse)
  warehouse: Relation<Warehouse>;

  // For querying
  warehouseId: number;

  @ManyToOne(() => Product, (product) => product.inventories, {
    nullable: false,
  })
  @FilterableField(() => Product)
  product: Relation<Product>;

  // For querying
  productId: number;

  @OneToMany(() => StockTransfer, (stockTransfer) => stockTransfer.inventory)
  @FilterableField(() => StockTransfer)
  stockTransfers: Relation<StockTransfer>;

  @CreateDateColumn()
  @FilterableField(() => GraphQLISODateTime)
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  @FilterableField(() => GraphQLISODateTime)
  updatedAt: Date;
}
