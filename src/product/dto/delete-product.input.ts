import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class DeleteProductInput {
  @IsNumber()
  @Field()
  id: number;
}
