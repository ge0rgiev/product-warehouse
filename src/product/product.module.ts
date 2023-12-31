import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsQueryGraphQLModule } from '@nestjs-query/query-graphql';
import { NestjsQueryTypeOrmModule } from '@nestjs-query/query-typeorm';
import { Product } from './entities/product.entity';
import { JwtAuthGuard } from '../shared/guard/jwt-auth.guard';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([Product])],
      resolvers: [
        {
          DTOClass: Product,
          EntityClass: Product,
          guards: [JwtAuthGuard],
          read: {
            one: { disabled: true },
            many: { name: 'ProductList' },
          },
          create: {
            CreateDTOClass: CreateProductInput,
            one: { name: 'CreateProduct' },
            many: { disabled: true },
          },
          update: {
            UpdateDTOClass: UpdateProductInput,
            one: { name: 'UpdateProduct' },
            many: { disabled: true },
          },
          delete: { disabled: true },
        },
      ],
    }),
  ],
  providers: [ProductResolver, ProductService],
})
export class ProductModule {}
