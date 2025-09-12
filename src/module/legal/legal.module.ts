import { Module } from '@nestjs/common';
import { LegalResolver } from './adapter/resolver/legal.resolver';
import { LegalUsecase } from './usecase/legal.usecase';
import { LEGAL_USECASE } from './usecase/interface/legal.usecase.interface';

@Module({
  providers: [
    LegalResolver,
    {
      provide: LEGAL_USECASE,
      useClass: LegalUsecase,
    }
  ],
  exports: [],
})
export class LegalModule {} 