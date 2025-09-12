import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeResolver } from './adapter/graphql/stripe.resolver';
import { StripeService } from './usecase/stripe.service';
import { UserEntity } from '../user/domain/model/user.entity.typeorm';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]), // register User entity here so repository is available
    forwardRef(() => UserModule), // ✅ restore with forwardRef
  ],
  providers: [StripeResolver, StripeService],
  exports: [StripeService],
})
export class StripeModule {}
