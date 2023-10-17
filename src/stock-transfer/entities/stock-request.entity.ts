import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { StockTransfer } from './stock-transfer.entity';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { FilterableField } from '@nestjs-query/query-graphql';

@Entity()
@ObjectType()
export class StockRequest {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column('timestamp')
  @FilterableField(() => GraphQLISODateTime)
  scheduledAt: Date;

  @CreateDateColumn()
  @FilterableField(() => GraphQLISODateTime)
  createdAt: Date;

  @OneToOne(() => StockTransfer, (stockTransfer) => stockTransfer.stockRequest)
  @FilterableField(() => StockTransfer)
  stockTransfer: Relation<StockTransfer>;
}
