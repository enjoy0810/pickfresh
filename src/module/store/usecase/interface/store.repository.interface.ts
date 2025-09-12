import { Store } from '../../domain/model/store.entity';

export const STORE_REPOSITORY = 'STORE_REPOSITORY';

export interface IStoreRepository {
  findAll(): Promise<Store[]>;
  findById(id: string): Promise<Store | null>;
  findByOwnerId(ownerId: string): Promise<Store | null>;
  create(data: Partial<Store>): Promise<Store>;
  update(id: string, updates: Partial<Store>): Promise<Store | null>;
  delete(id: string): Promise<boolean>;
}
