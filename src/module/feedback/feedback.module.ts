import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './domain/entity/feedback.entity';
import { Product } from '../product/domain/model/product.entity';
import { UserEntity } from '../user/domain/model/user.entity.typeorm';
import { FeedbackService } from './feedback.service';
import { FeedbackResolver } from './feedback.resolver';
import { FeedbackController } from './feedback.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback, Product, UserEntity])], // 👈 include Product + UserEntity
  providers: [FeedbackService, FeedbackResolver],
  controllers: [FeedbackController],
  exports: [FeedbackService],
})
export class FeedbackModule {}
