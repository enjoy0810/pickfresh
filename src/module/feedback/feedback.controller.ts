import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Feedback } from './domain/entity/feedback.entity';

@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly service: FeedbackService) {}

  @Post()
  create(@Body() dto: CreateFeedbackDto): Promise<Feedback> {
    return this.service.create(dto);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Get('products/:productId')
  findByProduct(@Param('productId', new ParseUUIDPipe()) productId: string) {
    return this.service.findByProduct(productId);
  }

  @Get('sellers/:sellerId')
  findBySeller(@Param('sellerId', new ParseUUIDPipe()) sellerId: string) {
    return this.service.findBySeller(sellerId);
  }
}
