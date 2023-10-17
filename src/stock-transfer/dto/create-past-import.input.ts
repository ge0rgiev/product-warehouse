import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class CreatePastImportInput {
  @IsNumber()
  @Field(() => Int)
  productId: number;

  @IsNumber()
  @Field(() => Int)
  warehouseId: number;

  @IsNumber()
  @Field(() => Int)
  units: number;
}
