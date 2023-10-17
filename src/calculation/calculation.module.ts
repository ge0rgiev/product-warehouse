import { Module } from '@nestjs/common';
import { CalculationController } from './calculation.controller';
import { CalculationService } from './calculation.service';
import { CalculationApiService } from './calculation-api.service';

@Module({
  controllers: [CalculationController],
  providers: [CalculationService, CalculationApiService],
  exports: [CalculationApiService],
})
export class CalculationModule {}
