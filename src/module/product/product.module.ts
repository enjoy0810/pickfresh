// product.module.ts
import { Module } from '@nestjs/common';
import { ProductResolver } from './adapter/resolver/product.resolver';
import { ProductUsecase } from './usecase/product.usecase';
import { PRODUCT_REPOSITORY } from './usecase/interface/product.repository.interface';
import { ProductRepository } from './adapter/repository/product.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './domain/model/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [
    ProductResolver,
    ProductUsecase,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepository,
    },
  ],
  exports: [PRODUCT_REPOSITORY],   // 
})
export class ProductModule {}
