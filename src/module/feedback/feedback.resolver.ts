import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { FeedbackService } from './feedback.service';
import { Feedback } from './domain/entity/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Resolver(() => Feedback)
export class FeedbackResolver {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Mutation(() => Feedback)
  async createFeedback(@Args('input') input: CreateFeedbackDto) {
    return this.feedbackService.create(input);
  }

  @Query(() => [Feedback])
  async feedbacks(
    @Args('productId', { nullable: true }) productId?: string,
    @Args('sellerId', { nullable: true }) sellerId?: string,
  ) {
    if (productId) {
      return this.feedbackService.findByProduct(productId);
    }
    if (sellerId) {
      return this.feedbackService.findBySeller(sellerId);
    }
    return []; // nothing provided → return empty array
  }

  @Query(() => Feedback, { nullable: true })
  async feedback(@Args('feedbackId') feedbackId: string) {
    return this.feedbackService.findOne(feedbackId);
  }

}
