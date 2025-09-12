import { Module } from '@nestjs/common';
import { ProductModule } from '../../module/product/product.module';
import { UserModule } from '../../module/user/user.module';

import { AuthModule } from '../../module/auth/auth.module';
import { LegalModule } from '../../module/legal/legal.module';
import { ReviewModule } from '../../module/review/review.module';
import { StripeModule } from '../../module/stripe/stripe.module';
import { StoreModule } from '../../module/store/store.module';
import { OrderModule } from '../../module/order/order.module';
import { FeedbackModule } from '../../module/feedback/feedback.module';

import { ConfigModule } from '@nestjs/config';
import { GraphQLAppModule } from '../graphql/graphql.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Framework Modulesa
    GraphQLAppModule,
    DatabaseModule.register(),

    // App Modules
    AuthModule,
    ProductModule,
    ReviewModule,
    UserModule,
    LegalModule,
    StripeModule,
    StoreModule,
    OrderModule,
    FeedbackModule
  ],
})
export class AppModule {}
