// src/module/user/user.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserResolver } from './adapter/resolver/user.resolver';
import { UserUsecase } from './usecase/user.usecase';
import { UserRepository } from './adapter/repository/user.repository';
import { USER_REPOSITORY } from './usecase/interface/user.repository.interface';
import { USER_USECASE } from './usecase/interface/user.usecase.interface';
import { UserEntity } from './domain/model/user.entity.typeorm';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => StripeModule), // ✅ fix circular dependency
  ],
  providers: [
    UserResolver,
    {
      provide: USER_USECASE,
      useClass: UserUsecase,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [
    TypeOrmModule,
    {
      provide: USER_USECASE,
      useClass: UserUsecase,
    },
  ],
})
export class UserModule {}
