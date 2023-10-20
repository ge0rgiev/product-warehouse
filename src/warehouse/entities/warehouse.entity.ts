import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import {
  IDField,
  FilterableField,
  Authorize,
  BeforeCreateOne,
  CreateOneInputType,
} from '@nestjs-query/query-graphql';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { UserContext } from '../../shared/types';
import { Inventory } from './inventory.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
@ObjectType()
@Authorize({
  authorize: (context: UserContext) => ({
    supervisorId: { eq: context.req.user.id },
  }),
})
@BeforeCreateOne(function (
  input: CreateOneInputType<Warehouse>,
  context: UserContext,
) {
  const supervisor = context.req.user;
  return { input: { ...input.input, supervisor } };
})
export class Warehouse {
  @PrimaryGeneratedColumn()
  @IDField(() => ID)
  id: number;

  @Column()
  @FilterableField()
  name: string;

  @Column()
  @FilterableField()
  isHazardous: boolean;

  @Column()
  @FilterableField(() => Int)
  capacity: number;

  @Column({ default: 0 })
  @Field(() => Int)
  usedCapacity: number;

  @Column({ default: 0 })
  @Field(() => Int)
  reservedCapacity: number;

  @ManyToOne(() => User, (user) => user.warehouses, { nullable: false })
  supervisor: Relation<User>;

  @OneToMany(() => Warehouse, (warehouse) => warehouse.inventories)
  @Field(() => [Inventory], { nullable: true })
  inventories: Relation<Inventory>;

  @BeforeUpdate()
  ensureCapacityDoesNotExceed() {
    const currentCapacity = this.usedCapacity + this.usedCapacity;
    if (currentCapacity > this.capacity) {
      throw new Error('Current capacity cannot exceed maximum capacity.');
    }
  }

  @Field(() => Int)
  get availableCapacity(): number {
    const usedCapacity = this.usedCapacity + this.reservedCapacity;
    return this.capacity - usedCapacity;
  }

  // used for @Authorize only
  supervisorId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
