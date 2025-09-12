import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../../domain/model/store.entity';
import { IStoreRepository } from '../../usecase/interface/store.repository.interface';

@Injectable()
export class StoreRepository implements IStoreRepository {
  constructor(
    @InjectRepository(Store)
    private readonly repo: Repository<Store>,
  ) {}

  findAll(): Promise<Store[]> {
    return this.repo.find();
  }

  findById(id: string): Promise<Store | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByOwnerId(ownerId: string): Promise<Store | null> {
    return this.repo.findOne({ where: { ownerId } });
  }

  async create(data: Partial<Store>): Promise<Store> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: string, updates: Partial<Store>): Promise<Store | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) return null;
    Object.assign(existing, updates);
    return this.repo.save(existing);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
