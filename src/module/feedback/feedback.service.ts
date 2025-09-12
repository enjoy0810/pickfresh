import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './domain/entity/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UserEntity } from '../user/domain/model/user.entity.typeorm';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback) private readonly repo: Repository<Feedback>,
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
  ) {}

  async create(dto: CreateFeedbackDto): Promise<Feedback> {
    if (!dto.productId && !dto.sellerId) {
      throw new BadRequestException('Either productId or sellerId must be provided.');
    }
    if (dto.productId && dto.sellerId) {
      throw new BadRequestException('Provide only one of productId or sellerId.');
    }

    const fb = this.repo.create({
      pickupExperience: dto.pickupExperience,
      freshness: dto.freshness,
      flavor: dto.flavor,
      comment: dto.comment ?? null,
      productId: dto.productId ?? null, // plain string
      sellerId: dto.sellerId ?? null,   // uuid
    });

    if (dto.sellerId) {
      const seller = await this.userRepo.findOne({ where: { id: dto.sellerId } });
      if (!seller) throw new NotFoundException('Seller (user) not found');
      fb.seller = seller;
    }

    return this.repo.save(fb);
  }

  async findOne(id: string): Promise<Feedback | null> {
    // first fetch the feedback by id only
    const feedback = await this.repo.findOneBy({ id });
    if (!feedback) return null;

    // optionally load seller relation if it exists
    if (feedback.sellerId) {
      await this.repo.findOne({
        where: { id },
        relations: { seller: true },
      });
    }

    return feedback;
  }


  async findByProduct(productId: string): Promise<Feedback[]> {
    return this.repo.find({
      where: { productId },
      relations: { seller: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findBySeller(sellerId: string): Promise<Feedback[]> {
    return this.repo.find({
      where: { sellerId },
      relations: { seller: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findAll(): Promise<Feedback[]> {
    return this.repo.find({
      relations: { seller: true },
      order: { createdAt: 'DESC' },
    });
  }
}
