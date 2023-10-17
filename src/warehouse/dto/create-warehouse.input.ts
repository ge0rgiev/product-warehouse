import { InputType, Int, Field } from '@nestjs/graphql';
import { IsBoolean, IsNumber, MinLength } from 'class-validator';

@InputType()
export class CreateWarehouseInput {
  @MinLength(5)
  @Field()
  name: string;

  @IsBoolean()
  @Field()
  isHazardous: boolean;

  @IsNumber()
  @Field(() => Int)
  capacity: number;
}
