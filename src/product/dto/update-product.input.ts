import { InputType, Int, Field } from '@nestjs/graphql';
import { IsBoolean, IsOptional, Min, MinLength } from 'class-validator';

@InputType()
export class UpdateProductInput {
  @IsOptional()
  @MinLength(5)
  @Field({ nullable: true })
  name?: string;

  @IsOptional()
  @Min(1)
  @Field(() => Int, { nullable: true })
  sizePerUnit?: number;

  @IsOptional()
  @IsBoolean()
  @Field({ nullable: true })
  isHazardous?: boolean;
}
