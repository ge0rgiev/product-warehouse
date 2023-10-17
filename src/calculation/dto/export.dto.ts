import { IsNumber } from 'class-validator';

export class ExportDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  warehouseId: number;

  @IsNumber()
  amount: number;
}
