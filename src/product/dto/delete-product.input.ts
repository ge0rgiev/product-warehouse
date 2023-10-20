import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class DeleteProductInput {
  @IsNumber()
  @Field(() => Int)
  id: number;
}
