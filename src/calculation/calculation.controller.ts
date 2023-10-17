import {
  Controller,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { CalculationService } from './calculation.service';
import { JwtAuthGuard } from '../shared/guard/jwt-auth.guard';
import { CurrentUser } from '../shared/decorator/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { ExportDto } from './dto/export.dto';
import { ImportDto } from './dto/import.dto';

@UseGuards(JwtAuthGuard)
@Controller('calculation')
export class CalculationController {
  constructor(private readonly calculationService: CalculationService) {}

  @Post('import')
  async import(
    @CurrentUser() { id: userId }: User,
    @Body() importDto: ImportDto,
  ) {
    /**
     * Ownership of the product and warehouse
     */
    const isOwner = await this.calculationService.inventoryOwnership(
      importDto,
      userId,
    );

    if (!isOwner) {
      throw new UnauthorizedException('Not authorized to perform this import');
    }

    const product = await this.calculationService.getProduct(
      importDto.productId,
    );
    const warehouse = await this.calculationService.getWarehouse(
      importDto.warehouseId,
    );

    /**
     * Hazardous match
     */
    if (product.isHazardous !== warehouse.isHazardous) {
      throw new BadRequestException('Mixed imports not allowed.');
    }

    /**
     * Import amount <-> Warehouse capacity
     */
    const importAmount = product.sizePerUnit * importDto.units;
    const warehouseFreeCapacity =
      warehouse.capacity -
      (warehouse.usedCapacity + warehouse.reservedCapacity);

    if (importAmount > warehouseFreeCapacity) {
      throw new BadRequestException('Not ehough warehouse capacity.');
    }

    return { success: true };
  }

  @Post('export')
  async export(
    @CurrentUser() { id: userId }: User,
    @Body() exportDto: ExportDto,
  ) {
    /**
     * Ownership of the product and warehouse
     */
    const isOwner = await this.calculationService.inventoryOwnership(
      exportDto,
      userId,
    );

    if (!isOwner) {
      throw new UnauthorizedException('Not authorized to perform this import');
    }

    /**
     * Existing inventory and amount check -> export.amount <-> inventory.amount
     */
    const inventory = await this.calculationService.getInventory(
      exportDto.productId,
      exportDto.warehouseId,
    );

    if (!inventory) {
      throw new BadRequestException(
        'Export not possible for nonexistent inventory.',
      );
    }

    if (exportDto.amount > inventory.amount) {
      throw new BadRequestException('Export amount exceeds inventory amount.');
    }

    return { success: true };
  }
}
