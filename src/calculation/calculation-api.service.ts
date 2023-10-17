import { AugmentedRequest, RESTDataSource } from '@apollo/datasource-rest';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ImportDto } from 'src/calculation/dto/import.dto';
import { ExportDto } from './dto/export.dto';

@Injectable()
export class CalculationApiService extends RESTDataSource {
  private baseUrl: string;
  private token: string;

  constructor(private readonly configService: ConfigService) {
    super();
    this.baseURL = this.configService.get('rest.baseUrl');
  }

  setToken(token: string) {
    this.token = token;
  }

  async importValidationChecks(body: ImportDto) {
    return this.post(`${this.baseURL}/import`, {
      body,
    });
  }

  async exportValidationChecks(body: ExportDto) {
    return this.post(`${this.baseURL}/export`, {
      body,
    });
  }

  override willSendRequest(_path: string, request: AugmentedRequest) {
    request.headers['Authorization'] = this.token;
  }
}
