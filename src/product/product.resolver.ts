import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CurrentUser } from '../shared/decorator/current-user.decorator';
import { JwtAuthGuard } from '../shared/guard/jwt-auth.guard';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { DeleteProductInput } from './dto/delete-product.input';
import { User } from '../user/entities/user.entity';

@Resolver(() => Product)
@UseGuards(JwtAuthGuard)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation(() => Product, { name: 'DeleteProduct' })
  async deleteProduct(
    @CurrentUser() { id: userId }: User,
    @Args('deleteProductInput') { id: productId }: DeleteProductInput,
  ): Promise<Product> {
    try {
      const product = await this.productService.findById(productId);
      if (product.createdBy.id !== userId) {
        throw new UnauthorizedException();
      }
      await this.productService.softDelete(product.id);
      return product;
    } catch (err) {
      throw new UnauthorizedException('The product doesn`t exists.');
    }
  }
}
