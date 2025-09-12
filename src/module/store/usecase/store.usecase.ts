import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Store } from '../domain/model/store.entity';
import { IStoreUsecase } from './interface/store.usecase.interface';
import { IStoreRepository, STORE_REPOSITORY } from './interface/store.repository.interface';
import { CreateStoreInput } from '../adapter/input/create-store.input';
import { UpdateStoreInput } from '../adapter/input/update-store.input';
import { Address } from '../../../framework/shared/domain/address.model';

@Injectable()
export class StoreUsecase implements IStoreUsecase {
  constructor(
    @Inject(STORE_REPOSITORY)
    private readonly storeRepository: IStoreRepository
  ) {}

  findAll(): Promise<Store[]> {
    return this.storeRepository.findAll();
  }

  findById(id: string): Promise<Store | null> {
    return this.storeRepository.findById(id);
  }

  findByOwnerId(ownerId: string): Promise<Store | null> {
    return this.storeRepository.findByOwnerId(ownerId);
  }

  async createWithOwner(ownerId: string, input: CreateStoreInput): Promise<Store> {
    const exists = await this.storeRepository.findByOwnerId(ownerId);
    if (exists) throw new BadRequestException('User already has a store');

    const { name, ownerFullName, address, description } = input;
    const data: Partial<Store> = {
      name,
      ownerFullName,
      description,
      ownerId,
      address: address ? new Address(address) : undefined,
    };
    return this.storeRepository.create(data);
  }

  async update(id: string, input: UpdateStoreInput): Promise<Store | null> {
    const updates: Partial<Store> = {};
    if (input.name !== undefined) updates.name = input.name;
    if (input.ownerFullName !== undefined) updates.ownerFullName = input.ownerFullName;
    if (input.description !== undefined) updates.description = input.description;
    if (input.address !== undefined) updates.address = new Address(input.address);
    return this.storeRepository.update(id, updates);
  }

  delete(id: string): Promise<boolean> {
    return this.storeRepository.delete(id);
  }
}
