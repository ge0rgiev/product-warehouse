import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Inventory } from '../../warehouse/entities/inventory.entity';
import { TransferStatus, TransferType } from '../interface';
import { StockRequest } from './stock-request.entity';
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
export class StockTransfer {
  @PrimaryGeneratedColumn()
  @IDField(() => ID)
  id: number;

  @Column()
  @FilterableField(() => Int)
  amount: number;

  @Column({
    type: 'enum',
    enum: TransferType,
  })
  @FilterableField(() => TransferType)
  transferType: TransferType;

  @Column({
    type: 'enum',
    enum: TransferStatus,
    default: TransferStatus.PAST,
  })
  @FilterableField(() => TransferStatus)
  status: TransferStatus;

  @CreateDateColumn()
  @FilterableField(() => GraphQLISODateTime)
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  @FilterableField(() => GraphQLISODateTime)
  updatedAt: Date;

  @ManyToOne(() => Inventory, (inventory) => inventory.stockTransfers, {
    nullable: false,
  })
  @Field(() => Inventory)
  inventory: Relation<Inventory>;

  @OneToOne(() => StockRequest, (stockRequest) => stockRequest.stockTransfer, {
    nullable: true,
  })
  @JoinColumn()
  @Field(() => StockRequest)
  stockRequest: Relation<StockRequest>;
}
