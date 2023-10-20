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
    return this.productRespository.findOneOrFail({
      where: { id },
      relations: ['createdBy'],
    });
  }

  async softDelete(productId: number): Promise<boolean> {
    const { affected } = await this.productRespository.softDelete(productId);
    return affected === 1;
  }
}
