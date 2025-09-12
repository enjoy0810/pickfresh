import { Product } from '../../domain/model/product.entity';

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findByIds(ids: string[]): Promise<Product[]>;
  create(product: Partial<Product>): Promise<Product>;
  update(id: string, updates: Partial<Product>): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
}
