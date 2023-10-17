import { InputType, Int, Field } from '@nestjs/graphql';
import { IsBoolean, Min, MinLength } from 'class-validator';

@InputType()
export class CreateProductInput {
  @MinLength(5)
  @Field()
  name: string;

  @Min(1)
  @Field(() => Int)
  sizePerUnit: number;

  @IsBoolean()
  @Field()
  isHazardous: boolean;
}
