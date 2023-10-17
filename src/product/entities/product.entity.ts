import { ObjectType, Int, ID, Field } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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
import { User } from '../../user/entities/user.entity';
import { UserContext } from '../../shared/types';
import { Inventory } from '../../warehouse/entities/inventory.entity';

// todo: SOFT DELETE and take into account isDeleted

@Entity()
@ObjectType()
@Authorize({
  authorize: (context: UserContext) => ({
    createdById: { eq: context.req.user.id },
  }),
})
@BeforeCreateOne(function (
  input: CreateOneInputType<Product>,
  context: UserContext,
) {
  const createdBy = context.req.user;
  return { input: { ...input.input, createdBy } };
})
export class Product {
  @PrimaryGeneratedColumn()
  @IDField(() => ID)
  id: number;

  @Column()
  @FilterableField()
  name: string;

  @Column()
  @FilterableField(() => Int)
  sizePerUnit: number;

  @Column()
  @FilterableField()
  isHazardous: boolean;

  @ManyToOne(() => User, (user) => user.products, { nullable: false })
  @JoinColumn()
  @Field(() => User)
  createdBy: Relation<User>;

  @OneToMany(() => Inventory, (inventory) => inventory.product)
  inventories: Relation<Inventory>;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  @FilterableField()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  // used for @Authorize only
  createdById: number;
}
