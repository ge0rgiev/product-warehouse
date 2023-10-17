import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Warehouse } from '../../warehouse/entities/warehouse.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column()
  password: string;

  @Column()
  @Field()
  name: string;

  @OneToMany(() => Product, (product) => product.createdBy)
  products?: Relation<Product>;

  @OneToMany(() => Warehouse, (warehouse) => warehouse.supervisor)
  warehouses?: Relation<Warehouse>;
}
