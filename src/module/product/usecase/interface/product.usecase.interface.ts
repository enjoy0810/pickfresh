import { Product } from '../../domain/model/product.entity';
import { CreateProductInput } from '../../adapter/input/create-product.input';
import { UpdateProductInput } from '../../adapter/input/update-product.input';

export interface IProductUsecase {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(input: CreateProductInput): Promise<Product>;
  update(id: string, input: UpdateProductInput): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
}
