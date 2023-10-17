import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRespository: Repository<Product>,
  ) {}

  async findById(id: number): Promise<Product> {
    return this.productRespository.findOneBy({ id });
  }

  async softDelete(product: Product): Promise<Product> {
    return this.productRespository.save({ ...product, isDeleted: true });
  }
}
