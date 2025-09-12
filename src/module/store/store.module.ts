// store/store.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './domain/model/store.entity';
import { StoreResolver } from './adapter/resolver/store.resolver';
import { StoreUsecase } from './usecase/store.usecase';
import { STORE_REPOSITORY } from './usecase/interface/store.repository.interface';
import { StoreRepository } from './adapter/repository/store.repository';

// ✅ add this import
import { AuthModule } from '../auth/auth.module';

@Module({
  // ✅ include AuthModule here
  imports: [TypeOrmModule.forFeature([Store]), AuthModule],
  providers: [
    StoreResolver,
    StoreUsecase,
    {
      provide: STORE_REPOSITORY,
      useClass: StoreRepository,
    },
  ],
})
export class StoreModule {}
