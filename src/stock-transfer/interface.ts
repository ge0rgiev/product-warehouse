import { registerEnumType } from '@nestjs/graphql';

export enum TransferType {
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
}

registerEnumType(TransferType, {
  name: 'TransferType',
  description: 'Enumeration for transfer types',
});

export enum TransferStatus {
  PAST = 'PAST',
  DONE = 'DONE',
  PENDING = 'PENDING',
}

registerEnumType(TransferStatus, {
  name: 'TransferStatus',
  description: 'Enumeration for transfer statuses',
});
