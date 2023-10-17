import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDate, IsNumber } from 'class-validator';

@InputType()
export class CreateFutureImportInput {
  @IsNumber()
  @Field(() => Int)
  productId: number;

  @IsNumber()
  @Field(() => Int)
  warehouseId: number;

  @IsNumber()
  @Field(() => Int)
  units: number;

  @IsDate()
  @Field()
  scheduledAt: Date;
}
