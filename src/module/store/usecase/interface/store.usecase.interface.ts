import { Store } from '../../domain/model/store.entity';
import { CreateStoreInput } from '../../adapter/input/create-store.input';
import { UpdateStoreInput } from '../../adapter/input/update-store.input';

export interface IStoreUsecase {
  findAll(): Promise<Store[]>;
  findById(id: string): Promise<Store | null>;
  findByOwnerId(ownerId: string): Promise<Store | null>;
  createWithOwner(ownerId: string, input: CreateStoreInput): Promise<Store>;
  update(id: string, input: UpdateStoreInput): Promise<Store | null>;
  delete(id: string): Promise<boolean>;
}
